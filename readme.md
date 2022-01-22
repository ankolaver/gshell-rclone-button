## Button to sync rclone remotes

### Aim
- simple gnome shell extension for top bar to allow syncing
- remind you periodically if you have not synced
- one-button click-to-sync and checks for files which may be overrided on the destination remote


### Gnome Button 
```js
// add Options to the menu 
let pmItem = new PopupMenu.PopupMenuItem('Normal Menu Item');

pmItem.add_child( new St.Label({ text: 'stuff' }) );
pmItem.add_child(new St.Icon({ gicon: Gio.icon_new_for_string(Me.path + "/icons/downloaddocs.png")}));

this.menu.addMenuItem(pmItem);

pmItem.connect('activate', () => {
    log('click');
    for (let remote in this._rcloneOptions){
        log(remote);
        log(this._rcloneOptions[remote]['icon']);
    };
```

### Basic Layout
```js
'use strict';

// imports
const {Clutter, Gio, St, GObject} = imports.gi;
const Main = imports.ui.main;
const Util = imports.misc.util;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;


const mainMenu = GObject.registerClass({
    
}, class mainMenu extends PanelMenu.Button {
    _init() {

    }
}

function init() {

}

function enable() {
    // initialise class
    mainMenu = new MainClass();
    
    // Add Drop Down Menu to the Top Status Bar in Gnome
    Main.panel.addToStatusArea('Main Menu', mainMenu, 1);

}    

function disable() {
    log(`disabling ${Me.metadata.name}`);
    mainMenu.destroy();
}   

```

Specifying the layout of Gtk Widgets in the Gnome Preferences tab via xml standard.
```xml
<object class="GtkListBoxRow">
    <child>
        <object class="GtkBox">
        <child>
            <object class="GtkBox">
            <property name="orientation">vertical</property>
            <property name="spacing">4</property>
            <child>
                <object class="GtkLabel">
                <!-- row header -->
                <property name="label" translatable="yes">Rclone remote location</property>
                <property name="halign">start</property>
                <property name="valign">center</property>
                <property name="hexpand">1</property>
                <style>
                    <class name="heading"/>
                </style>
                </object>
            </child>
            <child>
                <object class="GtkEntry">
                <property name="remotename" value=""/>
                <property name="background" value="red" start="5" end="10"/>
                </object>
            </child>
            </object>
        </child>
        </object>
    </child> 
</object>

```

### Good Resources 
- https://www.youtube.com/playlist?list=PLr3kuDAFECjZhW-p56BoVB7SubdUHBVQT
- https://gjs.guide/extensions/
- https://stackoverflow.com/questions/13107743/documentation-for-writing-gnome-shell-extensions
- https://stackoverflow.com/questions/50052926/docs-for-developing-gnome-shell-extensions

Reading other extensions for a rough idea of how to build the extension helps too
- https://github.com/corecoding/Vitals