import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../firebaseConfig";
import { useUser } from "../../context/useUser";
import { arrayUnion } from "firebase/firestore";
import {
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import DeleteConfirmation from "./DeleteConfirmation";
import LoadingSpinner from "./LoadingSpinner";
import SortDropdown from "./SortDropdown";
import { PlusIcon } from "@heroicons/react/24/solid"; // Added missing icon

const auth = getAuth();

export default function Feed() {
  const { t } = useTranslation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [text, setText] = useState("");
  const [showName, setShowName] = useState(true);
  const [showUniversity, setShowUniversity] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [showComments, setShowComments] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [sortBy, setSortBy] = useState("likes");
  const [editPost, setEditPost] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [showCommentDeleteConfirm, setShowCommentDeleteConfirm] = useState(null);
  const { userName, university } = useUser();

  const postsRef = useMemo(() => collection(db, "posts"), []);
  const postsQuery = useMemo(() => query(postsRef, orderBy("createdAt", "desc")), [postsRef]);

  const sortedPosts = useMemo(() => {
    if (!posts.length) return [];
    return [...posts].sort((a, b) => {
      if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
      if (sortBy === "comments") {
        const aComments = comments[a.id]?.length || 0;
        const bComments = comments[b.id]?.length || 0;
        return bComments - aComments;
      }
      return 0;
    });
  }, [posts, comments, sortBy]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
          setConnectionStatus("connecting");
        } catch (err) {
          console.error("Auth initialization error:", err);
          setError(t("feed.errors.auth_init_failed", { message: err.message }));
          setConnectionStatus("error");
        }
      }
    };

    initializeAuth();

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setError(t("feed.errors.unauthenticated"));
        setConnectionStatus("error");
        return;
      }

      setConnectionStatus("connecting");
      setError(null);

      const unsubscribePosts = onSnapshot(
        postsQuery,
        (snapshot) => {
          try {
            setConnectionStatus("connected");
            const postsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              authorId: doc.data().authorId || "anonymous",
            }));
            setPosts(postsData);
            setError(null);
          } catch (err) {
            console.error("Error processing posts:", err);
            setConnectionStatus("error");
            setError(t("feed.errors.load_posts_failed"));
          }
        },
        (error) => {
          console.error("Firestore connection error:", error);
          setConnectionStatus("error");
          if (error.code === "permission-denied") {
            setError(t("feed.errors.permission_denied"));
          } else if (error.code === "unavailable") {
            setError(t("feed.errors.service_unavailable"));
          } else if (error.code === "unauthenticated") {
            setError(t("feed.errors.unauthenticated"));
          } else {
            setError(
              t("feed.errors.connection_failed", {
                message: error.message || t("feed.errors.unknown"),
              })
            );
          }
        }
      );

      const commentsRef = collection(db, "comments");
      const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
      const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = {};
        snapshot.docs.forEach((doc) => {
          const comment = { id: doc.id, ...doc.data() };
          const postId = comment.postId;
          if (!commentsData[postId]) commentsData[postId] = [];
          commentsData[postId].push(comment);
        });
        setComments(commentsData);
      }, (error) => {
        console.error("Comments snapshot error:", error);
      });

      return () => {
        unsubscribePosts();
        unsubscribeComments();
      };
    });

    return () => unsubscribeAuth();
  }, [postsQuery, t]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(t("feed.errors.file_size_exceeded"));
        return;
      }
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert(t("feed.errors.invalid_file_type"));
        return;
      }
      setSelectedFile(file);
    }
  }, [t]);

  const resetForm = useCallback(() => {
    setText("");
    setShowName(true);
    setShowUniversity(true);
    setSelectedFile(null);
    setFileInputKey(Date.now());
    setEditPost(null);
  }, []);

  const handlePostSubmit = useCallback(async () => {
    if (!text.trim() && !selectedFile) {
      alert(t("feed.errors.empty_post"));
      return;
    }

    setLoading(true);
    setError(null);
    let uploadedFileUrl = null;

    try {
      if (selectedFile) {
        const fileRef = ref(storage, `posts/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(fileRef, selectedFile);
        uploadedFileUrl = await getDownloadURL(snapshot.ref);
      }

      const userId = auth.currentUser?.uid; // Added null check
      if (!userId) {
        setError(t("feed.errors.unauthenticated"));
        return;
      }

      const postData = {
        name: showName ? userName || "Anonymous" : "Anonymous",
        university: showUniversity ? university || "Anonymous" : "Anonymous",
        content: text?.trim() || "",
        mediaUrl: uploadedFileUrl || "",
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        authorId: userId,
        editedAt: null,
      };

      if (editPost) {
        const postDocRef = doc(db, "posts", editPost.id);
        await updateDoc(postDocRef, {
          name: showName ? userName || "Anonymous" : "Anonymous",
          university: showUniversity ? university || "Anonymous" : "Anonymous",
          content: text?.trim() || "",
          mediaUrl: uploadedFileUrl || editPost.mediaUrl || "",
          editedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "posts"), postData);
      }

      resetForm();
      setShowCreatePost(false);
    } catch (error) {
      console.error("Error handling post:", error);
      if (error.code === "permission-denied") {
        setError(t("feed.errors.permission_denied"));
      } else if (error.code === "unavailable") {
        setError(t("feed.errors.service_unavailable"));
      } else if (error.code === "unauthenticated") {
        setError(t("feed.errors.unauthenticated"));
      } else {
        setError(
          t("feed.errors.post_failed", {
            message: error.message || t("feed.errors.unknown"),
          })
        );
      }
    } finally {
      setLoading(false);
    }
  }, [text, selectedFile, showName, showUniversity, resetForm, editPost, userName, university, t]);

  const handleLike = useCallback(async (postId) => {
    const userId = auth.currentUser?.uid; // Added null check
    if (!userId) {
      setError(t("feed.errors.unauthenticated"));
      return;
    }
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const hasLiked = post.likedBy && post.likedBy.includes(userId);

    try {
      const postDocRef = doc(db, "posts", postId);
      if (hasLiked) {
        await updateDoc(postDocRef, {
          likes: increment(-1),
          likedBy: post.likedBy.filter((id) => id !== userId),
        });
      } else {
        await updateDoc(postDocRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
        });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      if (error.code === "permission-denied") {
        setError(t("feed.errors.permission_denied"));
      } else if (error.code === "not-found") {
        setError(t("feed.errors.post_not_found"));
      } else {
        setError(
          t("feed.errors.like_failed", {
            message: error.message || t("feed.errors.unknown"),
          })
        );
      }
    }
  }, [posts, t]);

  const handleDeletePost = useCallback(async (postId) => {
    setDeleteLoading(true);
    try {
      const userId = auth.currentUser?.uid; // Added null check
      if (!userId) {
        setError(t("feed.errors.unauthenticated"));
        return;
      }
      const post = posts.find((p) => p.id === postId);
      if (post && post.authorId !== userId) {
        setError(t("feed.errors.permission_denied"));
        setDeleteLoading(false);
        return;
      }
      await deleteDoc(doc(db, "posts", postId));
      setShowDeleteConfirm(null);
      setOpenDropdowns(new Set());
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.code === "permission-denied") {
        setError(t("feed.errors.permission_denied"));
      } else if (error.code === "not-found") {
        setError(t("feed.errors.post_not_found"));
      } else {
        setError(
          t("feed.errors.delete_post_failed", {
            message: error.message || t("feed.errors.unknown"),
          })
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [posts, t]);

  const handleCommentSubmit = useCallback(async (postId) => {
    const comment = commentText[postId]?.trim();
    if (!comment) return;

    try {
      const userId = auth.currentUser?.uid; // Added null check
      if (!userId) {
        setError(t("feed.errors.unauthenticated"));
        return;
      }
      const commentData = {
        postId,
        content: comment,
        authorId: userId,
        authorName: userName || "Anonymous",
        createdAt: serverTimestamp(),
      };

      if (editComment) {
        const commentDocRef = doc(db, "comments", editComment.id);
        await updateDoc(commentDocRef, {
          content: comment,
          editedAt: serverTimestamp(),
        });
        setEditComment(null);
      } else {
        await addDoc(collection(db, "comments"), commentData);
      }

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error handling comment:", error);
      setError(
        t("feed.errors.comment_failed", {
          message: error.message || t("feed.errors.unknown"),
        })
      );
    }
  }, [commentText, editComment, userName, t]);

  const handleDeleteComment = useCallback(async (commentId) => {
    setDeleteLoading(true);
    try {
      const userId = auth.currentUser?.uid; // Added null check
      if (!userId) {
        setError(t("feed.errors.unauthenticated"));
        return;
      }
      const comment = (
        comments[
          Object.keys(comments).find((postId) => comments[postId].find((c) => c.id === commentId))
        ] || []
      ).find((c) => c.id === commentId);
      if (comment && comment.authorId !== userId) {
        setError(t("feed.errors.permission_denied"));
        setDeleteLoading(false);
        return;
      }
      await deleteDoc(doc(db, "comments", commentId));
      setShowCommentDeleteConfirm(null);
      setOpenDropdowns(new Set());
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.code === "permission-denied") {
        setError(t("feed.errors.permission_denied"));
      } else if (error.code === "not-found") {
        setError(t("feed.errors.comment_not_found"));
      } else {
        setError(
          t("feed.errors.delete_comment_failed", {
            message: error.message || t("feed.errors.unknown"),
          })
        );
      }
    } finally {
      setDeleteLoading(false);
    }
  }, [comments, t]);

  const toggleComments = useCallback((postId) => {
    setShowComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  }, []);

  const handleCommentChange = useCallback((postId, value) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: value,
    }));
  }, []);

  const toggleDropdown = useCallback((postId) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else {
        newSet.clear();
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns(new Set());
  }, []);

  const closeModal = useCallback(() => {
    setShowCreatePost(false);
    resetForm();
  }, [resetForm]);

  const handleEditPost = useCallback((post) => {
    setEditPost(post);
    setText(post.content || "");
    setShowName(post.name !== "Anonymous");
    setShowUniversity(post.university !== "Anonymous");
    setSelectedFile(null);
    setShowCreatePost(true);
    closeAllDropdowns();
  }, [closeAllDropdowns]);

  const handleEditComment = useCallback((comment, postId) => {
    setEditComment(comment);
    setCommentText((prev) => ({
      ...prev,
      [postId]: comment.content || "",
    }));
    closeAllDropdowns();
  }, [closeAllDropdowns]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showCreatePost) closeModal();
        else if (showDeleteConfirm) setShowDeleteConfirm(null);
        else if (showCommentDeleteConfirm) setShowCommentDeleteConfirm(null);
        else if (openDropdowns.size > 0) closeAllDropdowns();
        else if (showComments.size > 0) setShowComments(new Set());
      }
    };

    const handleClickOutside = (e) => {
      if (openDropdowns.size > 0 && !e.target.closest(".dropdown-container")) closeAllDropdowns();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    if (showCreatePost) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showCreatePost, showDeleteConfirm, showCommentDeleteConfirm, openDropdowns, closeModal, closeAllDropdowns]);

  if (connectionStatus === "connecting") return <LoadingSpinner message={t("feed.connecting")} />;
  if (error)
    return (
      <div className="max-w-full sm:max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-semibold mb-2">{t("feed.connection_error.title")}</h3>
          <p className="mb-4">{error}</p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>{t("feed.connection_error.troubleshooting")}</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>{t("feed.connection_error.check_config")}</li>
              <li>{t("feed.connection_error.verify_rules")}</li>
              <li>{t("feed.connection_error.check_project")}</li>
              <li>{t("feed.connection_error.check_connection")}</li>
            </ul>
          </div>
          <button
            onClick={() => {
              setError(null);
              setConnectionStatus("connecting");
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {t("feed.connection_error.retry")}
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-full sm:max-w-2xl mx-auto p-8">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base sm:text-lg mb-4">{t("feed.no_posts")}</p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-black text-white px-4 sm:px-6 py-2 rounded-lg transition-colors"
          >
            {t("feed.create_first_post")}
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} t={t} />
          </div>
          <div className="space-y-6">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments[post.id] || []}
                showComments={showComments.has(post.id)}
                openDropdowns={openDropdowns}
                toggleComments={toggleComments}
                toggleDropdown={toggleDropdown}
                handleLike={handleLike}
                handleEditPost={handleEditPost}
                handleDeletePost={handleDeletePost}
                setShowDeleteConfirm={setShowDeleteConfirm}
                closeAllDropdowns={closeAllDropdowns}
                handleCommentSubmit={handleCommentSubmit}
                handleCommentChange={handleCommentChange}
                commentText={commentText[post.id] || ""}
                editComment={editComment}
                handleEditComment={handleEditComment}
                setShowCommentDeleteConfirm={setShowCommentDeleteConfirm}
                handleDeleteComment={handleDeleteComment}
                userId={auth.currentUser?.uid || ""}
                t={t}
              />
            ))}
          </div>
        </>
      )}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
        aria-label={t("feed.create_post")}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <CreatePostModal
        show={showCreatePost}
        text={text}
        setText={setText}
        handleFileChange={handleFileChange}
        selectedFile={selectedFile}
        fileInputKey={fileInputKey}
        showName={showName}
        setShowName={setShowName}
        showUniversity={showUniversity}
        setShowUniversity={setShowUniversity}
        handlePostSubmit={handlePostSubmit}
        closeModal={closeModal}
        loading={loading}
        error={error}
        setError={setError}
        editPost={editPost}
        userName={userName}
        university={university}
        t={t}
      />
      <DeleteConfirmation
        show={showDeleteConfirm !== null}
        onConfirm={() => handleDeletePost(showDeleteConfirm)}
        onCancel={() => setShowDeleteConfirm(null)}
        loading={deleteLoading}
        title={t("feed.delete_post.title")}
        message={t("feed.delete_post.message")}
        confirmText={t("feed.delete_post.confirm")}
        cancelText={t("feed.delete_post.cancel")}
        t={t}
      />
      <DeleteConfirmation
        show={showCommentDeleteConfirm !== null}
        onConfirm={() => handleDeleteComment(showCommentDeleteConfirm)}
        onCancel={() => setShowCommentDeleteConfirm(null)}
        loading={deleteLoading}
        title={t("feed.delete_comment.title")}
        message={t("feed.delete_comment.message")}
        confirmText={t("feed.delete_comment.confirm")}
        cancelText={t("feed.delete_comment.cancel")}
        t={t}
      />
    </div>
  );
}