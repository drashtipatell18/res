import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key : "ea4d04500b0421d6ee18",
      // secret : "5dbd05cdfee574fb5ee9",
      cluster : "ap2",
    encrypted: true,
});

export default echo;