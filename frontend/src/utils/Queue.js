export class Queue {
  constructor(songs = []) {
    this.songs = songs;
  }

  enqueue(song) {
    this.songs.push(song);
  }

  dequeue() {
    if (this.isEmpty()) {
      console.warn("Cannot dequeue: Queue is empty.");
      return null;
    }

    return this.songs.shift();
  }

  dequeueIndex(index) {
    if (index < 0 && index >= this.songs.length) {
      console.error(`Index out of bounds. Length: ${this.songs.length}`);
      return null;
    }

    return index === 0 ? this.dequeue() : this.songs.splice(index, 1)[0];
  }

  peek() {
    return this.isEmpty() ? null : this.songs[0];
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
      console.warn("Queue is empty");
      return;
    }

    console.log("Current queue");
    this.songs.forEach((song, index) => {
      console.log(`${index + 1} | ${song}`);
    });
  }
}
