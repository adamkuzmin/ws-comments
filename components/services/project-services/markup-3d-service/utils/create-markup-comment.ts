export const createMarkupComment = (content: string) => {
  const parentElement = document.createElement("div");
  parentElement.classList.add("MuiPaper-root");

  parentElement.style.backgroundColor = "white";
  parentElement.style.maxWidth = "250px";
  parentElement.style.overflow = "hidden";

  const contentElement = document.createElement("p");
  contentElement.textContent = content;
  contentElement.style.margin = "0";
  contentElement.style.padding = "0";
  contentElement.style.fontSize = "12px";
  contentElement.style.overflowWrap = "break-word"; // Use overflow-wrap instead of word-wrap

  parentElement.appendChild(contentElement);

  parentElement.style.position = "fixed";

  return parentElement;
};
