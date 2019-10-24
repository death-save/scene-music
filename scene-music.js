//create flag on scene entity to store a playlist id


//hook on sceneconfig render add a dropdown to the scene config to select the playlist
class SceneMusic {
    constructor() {
        this.data = {}
    }

    init() {
        this._hookOnRenderSceneSheet();
        this._hookOnUpdateScene();
    }

    get DEFAULT_CONFIG() {
        return {
            moduleName: "scene-music",
            flagName: "playlistId",
            templatePath: 'public/modules/scene-music/templates/playlist-select.html'
        }
    }

    _getAdditionalData(scene) {
        return {
            moduleName: this.DEFAULT_CONFIG.moduleName,
            flagName: this.DEFAULT_CONFIG.flagName,
            scenePlaylistFlag: game.scenes.get(scene.id).getFlag(this.DEFAULT_CONFIG.moduleName, this.DEFAULT_CONFIG.flagName),
            playlists: game.playlists.entities || []
        }
    }

    async _hookOnRenderSceneSheet() {
        Hooks.on("renderSceneSheet", async (app, html, data) => {
            await this._injectPlaylistSelector(app, html, data);
        });
    }
    
    _hookOnUpdateScene() {
        Hooks.on("updateScene", (scene, updateData, options, userId) => {
            const scenePlaylistFlag = scene.getFlag(this.DEFAULT_CONFIG.moduleName, this.DEFAULT_CONFIG.flagName);

            if ( scenePlaylistFlag && updateData.active === true ) {
                console.log(`Scene ${scene.name} is now Active`);
                this._playPlaylist(scenePlaylistFlag);
            }
        });
    }

    async _injectPlaylistSelector(app, html, sceneData) {
        const data = this._getAdditionalData(app.object);
        const submitButton = html.find('button[name="submit"]');
        const playlistSelector = await renderTemplate(this.DEFAULT_CONFIG.templatePath, data);

        submitButton.before(playlistSelector);
    }

    _playPlaylist(playlistId) {
        const playlist = game.playlists.get(playlistId);

        if (playlist) {
            playlist.play();
        }
    }
}

const sceneMusic = new SceneMusic();
sceneMusic.init();

//hook on scene update and if it's active and has the flag set, play the playlist
