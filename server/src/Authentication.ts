/**
 * Created by laurence-ho on 21/07/17.
 */

const authentication: any = {};

authentication.isLoggedIn = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).send({message: 'Please Login First'});
};

export = authentication;
