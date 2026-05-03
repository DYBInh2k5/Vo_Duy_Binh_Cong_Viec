import { PERSONAL_INFO } from '../constants';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 gap-8 bg-white dark:bg-stone-900 border-t-4 border-black dark:border-white mt-16 font-sans uppercase text-sm font-bold">
      <div className="text-xl font-black text-black dark:text-white">{PERSONAL_INFO.nickname}</div>
      <div className="text-black dark:text-white">© 2024 {PERSONAL_INFO.nickname}. FORM FOLLOWS FUNCTION.</div>
      <div className="flex gap-4">
        <a 
          className="px-4 py-1 text-black dark:text-white hover:bg-bauhaus-blue hover:text-white transition-all underline decoration-4 decoration-bauhaus-red hover:no-underline" 
          href={PERSONAL_INFO.socials.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a 
          className="px-4 py-1 text-black dark:text-white hover:bg-bauhaus-blue hover:text-white transition-all underline decoration-4 decoration-bauhaus-red hover:no-underline" 
          href={PERSONAL_INFO.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a 
          className="px-4 py-1 text-black dark:text-white hover:bg-bauhaus-blue hover:text-white transition-all underline decoration-4 decoration-bauhaus-red hover:no-underline" 
          href={PERSONAL_INFO.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
};

export default Footer;
