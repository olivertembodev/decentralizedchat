import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

const gun = Gun({
  peers: [process.env.REACT_APP_PEERS], // Put the relay node that you want here
});

const user = gun.user().recall({ sessionStorage: true });

export { gun, user };
