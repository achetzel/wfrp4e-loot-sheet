class Permission {

  /**
   * @returns {User|null} GM user or null
   */
  static getTargetGM() {
    let targetGM = null;
    game.users.forEach((u) => {
      if (u.isGM && u.active && u.viewedScene === game.user.viewedScene) {
        targetGM = u;
      }
    });

    return targetGM;
  }

  /**
   *
   * @param {number} level Permission level as {number} or {null}
   *
   * @returns {Array<object>|object}
   */
  static getPermissionInfo(level = null) {
    const permissions = {
      0: { class: 'fas fa-ban', description: game.i18n.localize('lsnpc.permissions.0.desc'), title: game.i18n.localize('lsnpc.permissions.0.title') },
      2: { class: 'fas fa-eye', description: game.i18n.localize('lsnpc.permissions.2.desc'), title: game.i18n.localize('lsnpc.permissions.2.title') },
      3: { class: 'fas fa-check', description: game.i18n.localize('lsnpc.permissions.3.desc'), title: game.i18n.localize('lsnpc.permissions.3.title') },
    };
    return (!level && level != 0) ? permissions : permissions[parseInt(level)];
  }

  /**
   * Change the permission of players for an actor
   * by reading the dataset value of a permission option
   *
   * @param {event} event
   * @param {Wfrp4eActor} actor
   *
   * @uses  {Array<User>} users The games users
   **/
  static setPermissions(event, actor) {
    event.preventDefault();
    const actorData = actor.data,
      lootPermissions = new PermissionControl(actor),
      htmlObject = event.currentTarget,
      users = game.users.entities,
      permissionValue = (!htmlObject.dataset.value)? 0 : parseInt(htmlObject.dataset.value);
    let currentPermissions = duplicate(actorData.permission);

    //update permissions object
    for (let user of users) {
      if (user.data.role === 1 || user.data.role === 2) {
        currentPermissions[user._id] = permissionValue;
      }
    }

    //update the actor with new permissions
    lootPermissions._updateObject(event, currentPermissions);
  }

  /**
   * @description Update the permissions of an player on the given actor
   *
   * @param {ActorData} actor A token actor sheets actorData
   * @param {event} event
   * @param {string|null} playerId
   * @param {number|null} newLevel
   *
   * @version 1.0.0
   */
  static cyclePermissions(
    event,
    actor,
    playerId = null,
    newLevel = null
  ) {
    event.preventDefault();
    const levels = [0, 2, 3];
    // Read player permission on this actor and adjust to new level
    let currentPermissions = duplicate(actor.data.permission),
      playerPermission = event.currentTarget.dataset.playerPermission;

    playerId = playerId || event.currentTarget.dataset.playerId;

    currentPermissions[playerId] = newLevel || levels[(levels.indexOf(parseInt(playerPermission)) + 1) % levels.length];
    const lootPermissions = new PermissionControl(actor);
    lootPermissions._updateObject(event, currentPermissions);
  }

  /**
   * Update given 'token' to permission 'level'
   *
   * @param {Wfrp4eToken} token A token object (default first selected token)
   *
   * @param {number} level permission level (default 0)
   * @param {Array<User>}
   *
   * @returns {Array<object>}
   *
   * @version 1.0.0
   */
  static _updatedUserPermissions(
    token = canvas.tokens.controlled[0],
    level = CONST.ENTITY_PERMISSIONS.OBSERVER || 0,
    lootingUsers = PermissionHelper.getPlayers(),
  ) {
    let currentPermissions = duplicate(token.actor.data.permission);

    lootingUsers.forEach((user) => {
      currentPermissions[user.data._id] = level;
    });

    return currentPermissions;
  }

  /**
   * Return the players current permissions or the sheets default permissions
   *
   * @param {Wfrp4eActor<data>} actorData
   * @param {user} player
   * @returns {number} Permission Enum value
   */
  static getLootPermissionForPlayer(actorData, player) {
    let defaultPermission = actorData.permission.default;
    if (player.data._id in actorData.permission) {
      return actorData.permission[player.data._id];
    } else if (typeof defaultPermission !== "undefined") {
      return defaultPermission;
    }

    return 0;
  }

  /**
   * Get all players and trusted players from game.users
   *
   * @return {Array<User>}
   */
  static getPlayers() {
    return game.users.filter((user) => {
      return (user.role == CONST.USER_ROLES.PLAYER || user.role == CONST.USER_ROLES.TRUSTED);
    });
  }
}

export { Permission };