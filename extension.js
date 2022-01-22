'use strict';

const {Clutter, Gio, St, GObject} = imports.gi;
const Main = imports.ui.main;
const Util = imports.misc.util;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;

function _startsync(executestr) {
    // Util.spawnCommandLine("notify-send 'hello'")
    Util.spawnCommandLine(executestr);
}

let rcloneMenu;

const RcloneMenu = GObject.registerClass({
    GTypeName: 'RcloneMenuButton',
}, class RcloneMenu extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);
        //super._init(0);

        // Main Icon
        let icon = new St.Icon ({
            style_class: 'system-status-icon',
            gicon: Gio.icon_new_for_string(Me.path + "/icons/syncc.png"),
        });
        
        this.add_child(icon);
        this._preferences = ExtensionUtils.getSettings();
        let path = this._preferences.get_string('save-directory');
        log(path.toString());
            
        this._rcloneOptions = {
             'docsupload': { 'icon': Me.path+'/icons/upload.svg',
                            'execute': 'python ' + Me.path + '/scripts/checkrclone.py --source_remote '+ path.toString() +' --destination MyRemoteName:'
                        },
             'docsdownload': { 'icon' : Me.path+'/icons/download.svg',
                            'execute': 'python ' + Me.path + '/scripts/checkrclone.py --source_remote MyRemoteName: --destination '+ path.toString()
                        },
        }

        // Customize menu layout
        // this._menuLayout = new St.BoxLayout({
        //     x_align: Clutter.ActorAlign.CENTER,
        //     y_align: Clutter.ActorAlign.CENTER,
        //     reactive: true,
        //     x_expand: true,
        //     vertical: false,
        //     clip_to_allocation: true,
        //     pack_start: false

        // });
        // this.add_actor(this._menuLayout);
        
        
        for (let remote in this._rcloneOptions){
        	var setremote = new PopupMenu.PopupMenuItem(remote.toString().toUpperCase()); // brackets can take in name of input as

            setremote.add_child( new St.Label({ 
                text: remote.toString(),
                style_class: 'panel-button maintext',
            }) );
            var remoteicon = new St.Icon({ 
                gicon: Gio.icon_new_for_string(this._rcloneOptions[remote]['icon']),
                //style_class: 'system-status-icon',
                // style: "width: 25px; display: inline-block; " 
                icon_size: 25
            });
            // remoteicon.set_icon_size(25);
        	setremote.add_child(remoteicon);
        	
            this.menu.addMenuItem(setremote);
            this.menu.addMenuItem( new PopupMenu.PopupSeparatorMenuItem() );    
            setremote.connect('activate', () => {
                log('click');
                log(this._rcloneOptions[remote]['icon']);
                _startsync(this._rcloneOptions[remote]['execute']);
            });
        }
        // this._indicator = new PanelMenu.Button(0.0, 'ddd', false);

        // this.settings = ExtensionUtils.getSettings(
        //     'backupdocs');
        
        // this.settings.bind(
        //     'show-indicator',
        //     this._indicator,
        //     'visible',
        //     Gio.SettingsBindFlags.DEFAULT
        // );

        // Main.panel.addToStatusArea(indicatorName, this._indicator);
    
             
}});

function init() {
    Util.spawnCommandLine("notify-send heee");
}

function enable() {
    log(`enabling ${Me.metadata.name}`);

    rcloneMenu = new RcloneMenu();
    
    // Add Drop Down Menu to the Top Status Bar in Gnome
    Main.panel.addToStatusArea('Rclone Menu', rcloneMenu, 1);

}    

function disable() {
    log(`disabling ${Me.metadata.name}`);
    rcloneMenu.destroy();
}   
