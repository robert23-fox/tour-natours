/*eslint-disable*/

export const showSpinner= (btn, loading = true, text) => {
    if (loading) {
      btn.classList.add("loading");
      btn.textContent = "Updating...";
    } else {
      btn.classList.remove("loading");
      btn.textContent = text;
    }
  }
  