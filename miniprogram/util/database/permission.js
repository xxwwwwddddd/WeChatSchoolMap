const _db = wx.cloud.database()
const cmd = _db.command

export class Permission {
  permissionList = []
  permissionVersion = 0

  constructor() {
    this.refreshPermissionList()
  }

  /**
   * 绑定新的权限配置
   * @param {string} superId 
   * @param {string} superType 
   */
  async bindNewPermission(superId, superType) {
    return await _db.collection('permission').add({
      super: {
        _id: superId,
        type: superType
      },
      owner: []
    })
  }

  /**
   * 删除权限配置
   * @param {string} permissionId 
   */
  async removePermission(permissionId) {
    return await _db.collection('permission').doc(permissionId).remove()
  }

  /**
   * 新增权限
   * @param {string} permissionId 
   * @param {string} openid 
   * @param {string} permission 
   */
  async addPermission(permissionId, openid, permission) {
    return await _db.collection('permission').doc(permissionId).update({
      owner: cmd.push({
        _openid: openid,
        permission: permission
      })
    })
  }

  /**
   * 获取权限配置
   * @param {string} superId 
   */
  async getPermission(superId) {
    return await _db.collection('permission').where({
      'super._id': superId
    }).get().then(res => res.data)
  }

  /**
   * 权限等级到名称的转换
   * @param {number} level 
   */
  levelToName(level) {
    let res = null
    this.permissionList.forEach(e => {
      if (level == e.level) res = e.name
    })
    return res
  }

  /**
   * 权限名称到等级的转换
   * @param {string} name 
   */
  nameToLevel(name) {
    let res = null
    this.permissionList.forEach(e => {
      if (name == e.name) res = e.level
    })
    return res
  }

  /**
   * 自动转换权限变量类型
   * @param {any} left 等式左侧的
   * @param {any} right 等式右侧的
   */
  autoConvert(left, right) {
    if (typeof left == 'string') left = this.nameToLevel(left)
    if (typeof right == 'string') right = this.nameToLevel(right)
    if (!this.checkValidity(left)) console.error('传入的权限参数非法')
    if (!this.checkValidity(right)) console.error('传入的权限参数非法')
    return {
      left: left,
      right: right
    }
  }

  /**
   * 检查权限合法性
   * @param {number} level 
   */
  checkValidity(level) {
    let validity = false
    this.permissionList.forEach(e => {
      if (e.level == level) validity = true
    })
    return validity
  }

  /**
   * 左边是否大于右边
   */
  isGreaterThan(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left > level.right)
  }

  isLessThanOrEquals(left, right) {
    return !this.isGreaterThan(left, right)
  }

  /**
   * 左边是否小于右边
   */
  isLessThan(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left < level.right)
  }

  isGreaterThanOrEquals(left, right) {
    return !this.isLessThan(left, right)
  }

  /**
   * 左边是否等于右边
   */
  isEquals(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left == level.right)
  }

  isNotEquals(left, right) {
    return !this.isEquals(left, right)
  }

  /**
   * 刷新权限列表
   */
  async refreshPermissionList() {
    await _db.collection('static').doc('permission').get().then(res => {
      this.permissionList = res.data.permission
      this.permissionVersion = res.data.version
      // console.log(this.permissionList)
    })
  }
}