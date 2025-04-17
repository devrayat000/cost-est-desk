import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { pdf } from "@react-pdf/renderer";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import PrintingDocument from "./components/menu/pdf";

const open = await MenuItem.new({
  id: "open",
  text: "Open",
  action: () => {
    open.setText("Text Item Changed");
    console.log("text pressed");
  },
});

const save = await MenuItem.new({
  id: "save",
  text: "Save",
  action: () => {
    open.setText("Text Item Changed");
    console.log("text pressed");
  },
});
const save_as = await MenuItem.new({
  id: "save-as",
  text: "Save As",
  action: () => {
    open.setText("Text Item Changed");
    console.log("text pressed");
  },
});

const copy = await PredefinedMenuItem.new({
  text: "Copy",
  item: "Copy",
});

const separator = await PredefinedMenuItem.new({
  text: "separator-text",
  item: "Separator",
});

const undo = await PredefinedMenuItem.new({
  text: "Undo",
  item: "Undo",
});

const redo = await PredefinedMenuItem.new({
  text: "Redo",
  item: "Redo",
});

const cut = await PredefinedMenuItem.new({
  text: "Cut",
  item: "Cut",
});

const paste = await PredefinedMenuItem.new({
  text: "Paste",
  item: "Paste",
});

const select_all = await PredefinedMenuItem.new({
  text: "Select All",
  item: "SelectAll",
});

const print = await MenuItem.new({
  id: "print",
  text: "Print",
  async action() {
    // const sections = getDefaultStore().get(formAtom);
    const document = pdf(
      <PrintingDocument
      // sections={sections}
      />
    );

    const blob = await document.toBlob();
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const webview = new WebviewWindow("pdf_print", {
      url: url,
      title: "PDF Print",
      closable: true,
      resizable: true,
      decorations: true,
    });
    webview.once("tauri://close-requested", () => {
      URL.revokeObjectURL(url);
    });

    webview.once("tauri://error", (e) => {
      console.error("❌ Failed to create Webview:", e);
    });
  },
});

const menu = await Menu.new({
  id: "main",
  items: [
    {
      id: "file",
      text: "File",
      items: [
        open,
        separator,
        save,
        save_as,
        {
          id: "export",
          text: "Export",
          action(id) {
            console.log("Export clicked", id);
          },
          items: [
            {
              id: "export-pdf",
              text: "Export as PDF",
              action(id) {
                console.log("Export PDF clicked", id);
              },
            },
            {
              id: "export-excel",
              text: "Export as Excel",
              action(id) {
                console.log("Export Excel clicked", id);
              },
            },
          ],
        },
        separator,
        print,
      ],
    },
    {
      id: "edit",
      text: "Edit",
      items: [copy, separator, undo, redo, cut, paste, select_all],
    },
    {
      id: "help",
      text: "Help",
      items: [
        {
          id: "about",
          text: "About",
          action: () => console.log("About clicked"),
        },
      ],
    },
  ],
});

// If a window was not created with an explicit menu or had one set explicitly,
// this menu will be assigned to it.
await menu.setAsAppMenu();
