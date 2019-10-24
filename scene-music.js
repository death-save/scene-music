class SceneMusic {

    init() {
        this._hookOnRenderSceneSheet();
        this._hookOnUpdateScene();
    }

    get DEFAULT_CONFIG() {
        return {
            moduleName: "scene-music",
            flagName: "playlistId",
            templatePath: "public/modules/scene-music/templates/playlist-select.html"
        }
    }

    _getAdditionalData(scene) {
        return {
            moduleName: this.DEFAULT_CONFIG.moduleName,
            flagName: this.DEFAULT_CONFIG.flagName,
            scenePlaylistFlag: game.scenes.get(scene.id).getFlag(this.DEFAULT_CONFIG.moduleName, this.DEFAULT_CONFIG.flagName) || " ",
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
            playlist.playAll();
        }
    }
}

const sceneMusic = new SceneMusic();
sceneMusic.init();
