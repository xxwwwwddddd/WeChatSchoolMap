const _db = wx.cloud.database()

export class Arch {
  /**
   * 获取全部建筑物信息
   * @param {string} campusId 校区ID
   */
  async getArchArray(campusId) {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllBySuperId',
        data: {
          collection: 'arch',
          superId: campusId
        }
      }).then(res => res.result.data)
    } catch (e) {
      return null
    }
  }

  /**
   * 添加建筑物
   * @param {string} campusId 校区ID
   * @param {object} arch 建筑物
   */
  async addArch(campusId, arch) {
    _db.collection('arch').add({
      data: {
        super: {
          _id: campusId,
          type: 'campus'
        },
        name: arch.name,
        logo: arch.logo,
        type: arch.type,
        geo: arch.geo
      }
    })
  }

  /**
   * 更新建筑物
   * @param {string} archId 
   * @param {object} arch 
   */
  updateArch(archId, arch) {
    console.log(arch)
    _db.collection('arch').doc(archId).update({
      data: arch
    })
  }

  /**
   * 删除指定建筑物
   * @param {string} archId 建筑物ID
   */
  removeArch(archId) {
    _db.collection('arch').doc(archId).remove()
  }
}