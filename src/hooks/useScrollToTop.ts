
/**
 * Custom hook to scroll to the top of the page
 * Useful for navigation links to ensure users start at the top of new pages
 */
export const useScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return scrollToTop;
};
