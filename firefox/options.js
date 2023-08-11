async function saveOptionsAsync(e) {
  if (e.submitter.id === "revert") {
    await browser.storage.sync.remove('filename_format');
    await browser.storage.sync.remove('open_in_new_tab');
    await browser.storage.sync.remove('redirect_pdf');
  } else if (e.submitter.id === "update") {
    await browser.storage.sync.set({
      'filename_format': document.querySelector("#new-filename-format").value,
      'open_in_new_tab': document.querySelector("#new-open-in-new-tab").checked,
      'redirect_pdf': document.querySelector("#new-redirect-pdf").checked,
    });
  } else if (e.submitter.id === "revert-pdf-viewer-url-prefix") {
    await browser.storage.sync.remove('pdf_viewer_url_prefix');
  } else if (e.submitter.id === "update-pdf-viewer-url-prefix") {
    await browser.storage.sync.set({
      'pdf_viewer_url_prefix': document.querySelector("#new-pdf-viewer-url-prefix").value,
    });
  }
  e.preventDefault();
  await restoreOptionsAsync();
}

async function restoreOptionsAsync() {
  const result = await browser.storage.sync.get({
    'filename_format': '${title}, ${firstAuthor} et al., ${publishedYear}, v${version}.pdf',
    'open_in_new_tab': true,
    'redirect_pdf': true,
    'pdf_viewer_url_prefix': '',
  });
  const filename_format = result.filename_format;
  document.querySelector("#filename-format").innerText = filename_format;
  document.querySelector("#new-filename-format").value = filename_format;
  const open_in_new_tab = result.open_in_new_tab;
  document.querySelector("#new-open-in-new-tab").checked = open_in_new_tab;
  document.querySelector("#open-in-new-tab").innerText = open_in_new_tab;
  const redirect_pdf = result.redirect_pdf;
  document.querySelector("#new-redirect-pdf").checked = redirect_pdf;
  document.querySelector("#redirect-pdf").innerText = redirect_pdf;
  const pdf_viewer_url_prefix = result.pdf_viewer_url_prefix;
  document.querySelector("#pdf-viewer-url-prefix").innerText = pdf_viewer_url_prefix;
  if (pdf_viewer_url_prefix !== '')
    document.querySelector("#new-pdf-viewer-url-prefix").value = pdf_viewer_url_prefix;
  else
    document.querySelector("#new-pdf-viewer-url-prefix").value = "https://mozilla.github.io/pdf.js/web/viewer.html?file=";
}

document.addEventListener('DOMContentLoaded', restoreOptionsAsync);
const forms = [...document.getElementsByTagName("form")]
forms.forEach(element => {
  element.addEventListener("submit", saveOptionsAsync);
})
