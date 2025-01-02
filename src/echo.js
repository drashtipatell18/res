import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key : "4fc8a6c3a8bed22b1439",
      // secret : "5dbd05cdfee574fb5ee9",
      cluster : "mt1",
    encrypted: true,
});

export default echo;