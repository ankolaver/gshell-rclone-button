'use strict';

const {Gio, GLib, Gtk, GObject} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = imports.misc.extensionUtils.getCurrentExtension();
// const St = imports.gi.St;
// St does not exist for a gtk script

function init() {
    log(`initializing ${Me.metadata.name} Preferences`);
}
/*

function buildPrefsWidget () {
  let widget = new MyPrefsWidget();
  widget.show();
  return widget;
}

const MyPrefsWidget = new GObject.Class({

  Name : "My.Prefs.Widget",
  GTypeName : "MyPrefsWidget",
  Extends : Gtk.Box,
  
  _init : function (params) {
  
    this.parent(params);
    this.margin = 20;
    this.set_spacing(15);
    this.set_orientation(Gtk.Orientation.VERTICAL);
    
    // On GNOME SHELL +3.36 you don't need to quit on destroy
    //this.connect('destroy', Gtk.main_quit);
    
    let myLabel = new Gtk.Label({
      label : "Translated Text"    
    });
    
    
    
    this.append(myLabel);
  }

});
*/

const Gettext = imports.gettext;
const Domain = Gettext.domain(Me.metadata.uuid);
const _ = Domain.gettext;

var BackupDocsExtensionPrefs = GObject.registerClass({
    GTypeName: 'BackupDocsExtensionPrefs',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'source_folder',
        'folder_chooser',
        'folder_chooser_button',
    ],
}, class BackupDocsExtensionPrefs extends Gtk.Box {
    _init(preferences) {
        super._init();
        this._preferences = preferences;
        this._sync();

        this._preferences.connect('changed', this._sync.bind(this));
    }

    _onBtnClicked(btn) {
        let parent = btn.get_root();
        this._folder_chooser.set_transient_for(parent);
        this._folder_chooser.show();
    }

    _onFileChooserResponse(native, response) {
        if (response !== Gtk.ResponseType.ACCEPT)
            return;

        const filePath = native.get_file().get_path();
        this._preferences.set_string('save-directory', filePath);
    }

    _sync() {
        const p = this._preferences.get_string('save-directory');
        if (GLib.file_test(p, GLib.FileTest.EXISTS)) {
            const file = Gio.File.new_for_path(p);
            this._folder_chooser.set_file(file);
            this._source_folder.set_text(_('Rclone Sync directory: %s').format(p));
        }
    }
});

// const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
// const entry = new Gtk.entry({
//     buffer: new Gtk.EntryBuffer()
// });
// box.add(entry);
// const button = new Gtk.Button({
//     label: 'Enter'
// });
// button.connect('clicked', () => {
//     log('Entry '+ entry.get_buffer().text);

// })
// box.add(button);
// const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
// win.connect('destroy', () => { Gtk.main_quit(); });
// win.add(box);
// win.show_all();
// Gtk.main();


function buildPrefsWidget() {
    const preferences = ExtensionUtils.getSettings();
    return new BackupDocsExtensionPrefs(preferences);
}
