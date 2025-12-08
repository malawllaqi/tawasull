import Pusher from "pusher-js";

// export const pusher = new Pusher(process.env.PUSHER_KEY as string, {
// 	cluster: process.env.PUSHER_CLUSTER as string,
// });
export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY as string, {
	cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
});
