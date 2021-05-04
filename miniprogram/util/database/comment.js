const _db = wx.cloud.database()

export class Comment {
  /**
   * 绑定新评论列表
   * @param {string} superId 
   * @param {string} superType arch, point 等
   * @returns {string} comment-list ID
   */
  async bindNewCommentList(superId, superType) {
    return await _db.collection('comment-list').add({
      data: {
        super: {
          _id: superId,
          type: superType
        },
        list: []
      }
    }).then(res => res._id)
  }

  /**
   * 删除以superId为父级的所有评论
   * @param {string} superId 父级id
   */
  async removeAllComment(superId) {
    try {
      _db.collection('comment-list').where({
        "super._id": superId
      }).get().then(res => {
        if (res.data[0] != null) {
          res.data[0].list.forEach(e => {
            // console.log(e)
            _db.collection('comment').doc(e).remove() //删除属于这个评论列表的所有评论
          })
          // console.log(res.data)
          _db.collection('comment-list').doc(res.data[0]._id).remove() //删除主评论表
        }
      })
    } catch (e) {
      
    }
  }
}