import { gun, user } from "../gun";
import { generateAddFriendCertificate } from "../certificates";

let addFriendRequest = async (publicKey, callback = (res) => {}) => {
  let addFriendRequestCertificate = await gun
    .user(publicKey)
    .get("certificates")
    .get("friendRequests");

  console.log("==", addFriendRequestCertificate)
  gun
    .user(publicKey)
    .get("friendRequests")
    .set(
      user.is.pub,
      ({ err }) => {
        if (err)
          return callback({
            errMessage: err,
            errCode: "friend-request-error",
            success: undefined,
          });
        else {
          generateAddFriendCertificate(
            publicKey,
            ({ errMessage, errCode, success }) => {
              if (errMessage) return callback({ errMessage, errCode, success });
              else
                return callback({
                  errMessage: undefined,
                  errCode: undefined,
                  success: "Friend request sent successfully.",
                });
            }
          );
        }
      },
      { opt: { cert: addFriendRequestCertificate } }
    );
};

export default addFriendRequest;
