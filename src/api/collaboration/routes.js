const routes = (handler) => [{
  method: 'POST',
  path: '/collaborations',
  handler: handler.postCollaboratorHandler,
  options: {
    auth: 'songs_jwt',
  },
},
{
  method: 'DELETE',
  path: '/collaborations',
  handler: handler.deleteCollaboratorHandler,
  options: {
    auth: 'songs_jwt',
  },
}];
module.exports = routes;
