# midi-parser
Parse MIDI data into JSON and back again.

This library is for you if:
- You need to parse raw midi data into a more readable format.
- You need to generate raw midi data to send to a device.
- You need to manage midi device registration with a library of your choosing (ie. work directly with browser or node-midi APIs)
- You need to easily parse all midi messages you receive.
- You do not want to use an event based approach to midi parsing.

```js
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

## Some other midi libraries you may find useful:

If this library doesn't fit the bill, try one of these...
- node-midi (open midi device ports with node)
- noble (open ble midi ports with node)
- midi-help (react to specific midi events like 'noteOn', 'cc', etc.)
- ble-midi-parser (get the raw midi data from a ble midi event which you can pass to this library)
- webmidi (easily work with browser Web Midi API)
- func-midi-parser (parse midi files)
- midi-parser-js (another midi file parser)
- midi-node (stream based midi file/event parser)
- 
