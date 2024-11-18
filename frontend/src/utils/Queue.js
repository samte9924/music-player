export class Queue {
  constructor(songs = []) {
    this.songs = songs;
  }

  enqueue(song) {
    this.songs.push(song);
  }

  dequeue() {
    return this.songs.shift();
  }

  dequeueIndex(index) {
    if (index <= 0) {
      return this.dequeue();
    }
    if (index >= this.songs.length) {
      console.error(`Index out of bounds. Length: ${this.songs.length}`);
      return;
    }

    return this.songs.splice(index, 1)[0];
  }

  peek() {
    return this.songs[0];
  }

  shuffle() {
    this.songs = this.songs.sort(() => Math.random() - 0.5);
  }

  isEmpty() {
    return this.songs.length === 0;
  }

  // can add max size and isFull method

  display() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
      return;
    }

    console.log("Current queue");
    for (let i = 0; i < this.songs.length; i++) {
      console.log(`${i + 1} | ${this.songs[i]}`);
    }
  }
}
