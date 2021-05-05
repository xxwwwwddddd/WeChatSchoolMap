const _db = wx.cloud.database()

export class Comment {
  /**
   * 获取属于该父级的所有评论
   * @param {string} superId 
   */
  async getAllComment(superId) {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllBySuperId',
        data: {
          collection: 'comment',
          superId: superId
        }
      }).then(res => res.result.data)
    } catch (e) {
      return null
    }
  }

  /**
   * 删除以superId为父级的所有评论
   * @param {string} superId 父级id
   */
  async removeAllComment(superId) {
    _db.collection('comment').where({
      'super._id': superId
    }).remove()
  }

  /**
   * 插入评论
   * @param {string} superId 
   * @param {string} superType 
   * @param {string} comment 
   */
  addComment(superId, superType, comment) {
    _db.collection('comment').add({
      data: {
        super: {
          _id: superId,
          type: superType
        },
        time: _db.serverDate(),
        reply: comment.reply,
        text: comment.text,
        image: comment.image
      }
    })
  }

  /**
   * 删除指定ID的评论
   * @param {string} commentId 
   */
  removeComment(commentId) {
    _db.collection('comment').doc(commentId).remove()
  }
}