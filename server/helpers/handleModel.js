/**
 * callback func for CRUD ops on models
 */
export default function(res) {
  return (err, model) => {
    if(err) {
      return res
        .status(400)
        .send(err);
    }
    if(!model) {
      return res.status(404);
    }
    return res
      .status(200)
      .send(model);
  };
}