import { useTranslation } from 'react-i18next';
import InstallApp from "./InstallApp";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    title: "EduNet",
    url: "#",
  },
  tagline = "Learning made easy.",
  menuItems = [
    {
      title: "Quick Links",
      links: [
        { text: "Features", url: "#features" },
        { text: "FAQ", url: "#faq" },
        { text: "Sign In", url: "#auth" },
        { text: "Contact", url: "https://wa.me/96894990747" },
        { text: "GitHub", url: "https://github.com/ham7a311" },
      ],
    },
  ],
  copyright = "© 2025 EduNet. All rights reserved.",
}: Footer2Props) => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900" id="contact">
      <div className="container mx-auto px-6 md:px-12">
        <footer>
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo + Tagline */}
            <div className="space-y-4">
              <a
                href={logo.url}
                target="_self"
                rel="noopener noreferrer"
                className="text-2xl font-bold transition-colors"
              >
                {t('footer.logo')}
              </a>
              <p className="font-medium text-gray-700 dark:text-gray-300 max-w-xs">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Menu Sections */}
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-gray-800 dark:text-gray-200">
                  {t(`footer.menuItems.${sectionIdx}.title`)}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      <a
                        href={link.url}
                        target="_self"
                        rel="noopener noreferrer"
                      >
                        {t(`footer.menuItems.${sectionIdx}.links.${linkIdx}.text`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 md:flex-row md:justify-between">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-4">
              <a
                href="https://github.com/ham7a311"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors hover:underline"
              >
                {t('footer.bottomLinks.github')}
              </a>
              <a
                href="https://wa.me/96894990747"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors hover:underline"
              >
                {t('footer.bottomLinks.whatsapp')}
              </a>
              <InstallApp/>
            </div>
          </div>
         
        </footer>
      </div>
    </section>
  );
};

export default Footer;