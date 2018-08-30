# midi-parser
Parse MIDI data into JSON and back again.

```
import { MidiMessage } from 'midi-message-parser';

const rawMidiData = [144, 60, 64]; // <-- imagine this came from a midi device.
const timestamp = 740; // <-- timestamp that came along with midi data.

// Take raw midi info (from node-midi, browser midi events, etc.)
// and parse it into something easier to understand.
const message = new MidiMessage(rawMidiData, timestamp);

// Message is a simple object describing the midi message.
console.log(message.type); // 'noteon'
console.log(message.channel); // 0
console.log(message.number); // 60 (the key pressed)
console.log(message.value); // 64 (the velocity)
console.log(message.timestamp); // 740
console.log(message.ccMode); // false (something like 'monoon' for channel mode messages)

// You can also construct one from a browser MidiMessageEvent
const message2 = new MidiMessage(midiMessageEvent);

// Or create one manually.
const message3 = new MidiMessage(
  'noteon',
  64, // note number
  60, // velocity
  2, // channel
  0, // timestamp
);

// You can convert a midi message back into raw midi data to send.
const outputMidiData = message.toMidiArray();

console.log(outputMidiData); // [144, 60, 64]
```
