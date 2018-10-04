import { MidiMessage } from './midi-message';

const pitchBendValue = 18546;

// Channel 0
const noteOn = [144, 60, 64];
const noteOff = [128, 60, 0];
const cc = [176, 3, 1];

// Channel 3
const noteOn3          = [146, 55, 113];
const noteOff3         = [130, 55, 0];
const cc3              = [178, 3, 1];
const pitch3           = [226, 114, 72]; // 18546
const modulation3      = [178, 1, 38];
const keyPressure3     = [162, 44, 34];
const channelPressure3 = [210, 17];
const programChange3   = [194, 19];

const allSoundsOff3       = [178, 120, 0];
const resetAll3           = [178, 121, 1];
const localControllerOn3  = [178, 122, 1];
const localControllerOff3 = [178, 122, 0];
const allNotesOff3        = [178, 123, 0];
const omniOff3            = [178, 124, 0];
const omniOn3             = [178, 125, 0];
const monoOn3             = [178, 126, 1];
const polyOn3             = [178, 127, 1];

describe('MidiMessage', () => {
  let midi;

  beforeEach(function() {
    midi = new MidiMessage();
  });

  it('should be able to create an empty midi message.', () => {
    expect(midi).toBeTruthy();
  });

  it('should be constructable with MIDI data.', () => {
    midi = new MidiMessage(noteOn, 207);
    expect(midi).toBeTruthy();
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(noteOn[1]);
    expect(midi.note).toEqual(noteOn[1]);
    expect(midi.value).toEqual(noteOn[2]);
    expect(midi.velocity).toEqual(noteOn[2]);
    expect(midi.channel).toEqual(0);
    expect(midi.timestamp).toEqual(207);
  });

  it('should be constructable from a parameter array.', () => {
    midi = new MidiMessage(['noteon', 40, 33, 7, 444]);
    expect(midi).toBeTruthy();
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(40);
    expect(midi.note).toEqual(40);
    expect(midi.value).toEqual(33);
    expect(midi.velocity).toEqual(33);
    expect(midi.channel).toEqual(7);
    expect(midi.timestamp).toEqual(444);
  });


  it('should be constructable with MIDI parameters.', () => {
    midi = new MidiMessage('noteon', 60, 64);
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(noteOn[1]);
    expect(midi.note).toEqual(noteOn[1]);
    expect(midi.value).toEqual(noteOn[2]);
    expect(midi.velocity).toEqual(noteOn[2]);
    expect(midi.channel).toEqual(0);
  });

  it('should be constructable from a note number.', () => {
    midi = new MidiMessage(78);
    expect(midi).toBeTruthy();
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(78);
    expect(midi.note).toEqual(78);
    expect(midi.value).toEqual(127);
    expect(midi.velocity).toEqual(127);
    expect(midi.channel).toEqual(0);
    expect(midi.timestamp).toEqual(0);
  });

  it('should be constructable from raw midi data parameters.', () => {
    midi = new MidiMessage(...noteOn, 300);
    expect(midi).toBeTruthy();
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(noteOn[1]);
    expect(midi.note).toEqual(noteOn[1]);
    expect(midi.value).toEqual(noteOn[2]);
    expect(midi.velocity).toEqual(noteOn[2]);
    expect(midi.channel).toEqual(0);
  });

  it('should be constructable with another MidiMessage.', () => {
    let original = new MidiMessage(noteOff);
    midi = new MidiMessage(original);
    expect(midi.type).toEqual('noteoff');
    expect(midi.number).toEqual(noteOff[1]);
    expect(midi.note).toEqual(noteOff[1]);
    expect(midi.value).toEqual(noteOff[2]);
    expect(midi.velocity).toEqual(noteOff[2]);
    expect(midi.channel).toEqual(0);
  });

  it('should be able to copy another MidiMessage.', () => {
    let original = new MidiMessage(noteOff);
    midi = new MidiMessage();
    midi.copy(original);
    expect(midi.type).toEqual('noteoff');
    expect(midi.number).toEqual(noteOff[1]);
    expect(midi.note).toEqual(noteOff[1]);
    expect(midi.value).toEqual(noteOff[2]);
    expect(midi.velocity).toEqual(noteOff[2]);
    expect(midi.channel).toEqual(0);
  });

  it('should be able to reset its parameters.', () => {
    midi = new MidiMessage(noteOn);
    midi.reset('cc', 3, 1);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(cc[1]);
    expect(midi.cc).toEqual(cc[1]);
    expect(midi.value).toEqual(cc[2]);
    expect(midi.channel).toEqual(0);
  });

  it('should be able to parse unknown.', () => {
    midi.fromMidiArray([0, 0]);
    expect(midi.type).toEqual('unknown');
    expect(midi.number).toEqual(0);
    expect(midi.value).toEqual(0);
    expect(midi.channel).toEqual(0);
  });

  it('should be able to parse note on.', () => {
    midi.fromMidiArray(noteOn3);
    expect(midi.type).toEqual('noteon');
    expect(midi.number).toEqual(noteOn3[1]);
    expect(midi.note).toEqual(noteOn3[1]);
    expect(midi.value).toEqual(noteOn3[2]);
    expect(midi.velocity).toEqual(noteOn3[2]);
    expect(midi.channel).toEqual(2);
  });

  it('should parse 0 velocity note on messages as note off.', () => {
    let n = noteOn3.slice();
    n[2] = 0;
    midi.fromMidiArray(n);
    expect(midi.type).toEqual('noteoff');
  });

  it('should be able to parse note off.', () => {
    midi.fromMidiArray(noteOff3);
    expect(midi.type).toEqual('noteoff');
    expect(midi.number).toEqual(noteOff3[1]);
    expect(midi.note).toEqual(noteOff3[1]);
    expect(midi.value).toEqual(noteOff3[2]);
    expect(midi.velocity).toEqual(noteOff3[2]);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse key pressure.', () => {
    midi.fromMidiArray(keyPressure3);
    expect(midi.type).toEqual('keypressure');
    expect(midi.number).toEqual(keyPressure3[1]);
    expect(midi.note).toEqual(keyPressure3[1]);
    expect(midi.value).toEqual(keyPressure3[2]);
    expect(midi.velocity).toEqual(keyPressure3[2]);
    expect(midi.pressure).toEqual(keyPressure3[2]);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse cc.', () => {
    midi.fromMidiArray(cc3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(cc3[1]);
    expect(midi.cc).toEqual(cc3[1]);
    expect(midi.value).toEqual(cc3[2]);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse channel pressure.', () => {
    midi.fromMidiArray(channelPressure3);
    expect(midi.type).toEqual('channelpressure');
    expect(midi.number).toEqual(channelPressure3[1]);
    expect(midi.pressure).toEqual(channelPressure3[1]);
    expect(midi.velocity).toEqual(channelPressure3[1]);
    expect(midi.value).toEqual(0);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse pitch bend.', () => {
    midi.fromMidiArray(pitch3);
    expect(midi.type).toEqual('pitchbend');
    expect(midi.number).toEqual(pitchBendValue);
    expect(midi.velocity).toEqual(pitchBendValue);
    expect(midi.pitchbend).toEqual(pitchBendValue);
    expect(midi.value).toEqual(0);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse program change.', () => {
    midi.fromMidiArray(programChange3);
    expect(midi.type).toEqual('programchange');
    expect(midi.number).toEqual(programChange3[1]);
    expect(midi.program).toEqual(programChange3[1]);
    expect(midi.value).toEqual(0);
    expect(midi.channel).toEqual(2);
  });

  it('should be able to parse all sounds off.', () => {
    midi.fromMidiArray(allSoundsOff3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(allSoundsOff3[1]);
    expect(midi.cc).toEqual(allSoundsOff3[1]);
    expect(midi.value).toEqual(allSoundsOff3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('allsoundsoff');
  });

  it('should be able to parse reset all.', () => {
    midi.fromMidiArray(resetAll3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(resetAll3[1]);
    expect(midi.cc).toEqual(resetAll3[1]);
    expect(midi.value).toEqual(resetAll3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('resetallcontrollers');
  });

  it('should be able to parse local controller.', () => {
    midi.fromMidiArray(localControllerOn3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(localControllerOn3[1]);
    expect(midi.cc).toEqual(localControllerOn3[1]);
    expect(midi.value).toEqual(localControllerOn3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('localcontrolleron');
  });

  it('should be able to parse all notes off.', () => {
    midi.fromMidiArray(localControllerOff3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(localControllerOff3[1]);
    expect(midi.cc).toEqual(localControllerOff3[1]);
    expect(midi.value).toEqual(localControllerOff3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('localcontrolleroff');
  });

  it('should be able to parse omni off.', () => {
    midi.fromMidiArray(allNotesOff3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(allNotesOff3[1]);
    expect(midi.cc).toEqual(allNotesOff3[1]);
    expect(midi.value).toEqual(allNotesOff3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('allnotesoff');
  });

  it('should be able to parse omni on.', () => {
    midi.fromMidiArray(omniOff3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(omniOff3[1]);
    expect(midi.cc).toEqual(omniOff3[1]);
    expect(midi.value).toEqual(omniOff3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('omnimodeoff');
  });

  it('should be able to parse mono on.', () => {
    midi.fromMidiArray(omniOn3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(omniOn3[1]);
    expect(midi.cc).toEqual(omniOn3[1]);
    expect(midi.value).toEqual(omniOn3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('omnimodeon');
  });

  it('should be able to parse poly on.', () => {
    midi.fromMidiArray(polyOn3);
    expect(midi.type).toEqual('controlchange');
    expect(midi.number).toEqual(polyOn3[1]);
    expect(midi.cc).toEqual(polyOn3[1]);
    expect(midi.value).toEqual(polyOn3[2]);
    expect(midi.channel).toEqual(2);
    expect(midi.ccMode).toEqual('polymodeon');
  });

  it('should be able to generate note on.', () => {
    midi.reset('noteon', noteOn3[1], noteOn3[2], 2);
    expect(midi.toMidiArray()).toEqual(noteOn3);
  });

  it('should be able to generate note off.', () => {
    midi.reset('noteoff', noteOff3[1], noteOff3[2], 2);
    expect(midi.toMidiArray()).toEqual(noteOff3);
  });

  it('should be able to generate key pressure.', () => {
    midi.reset('keypressure', keyPressure3[1], keyPressure3[2], 2);
    expect(midi.toMidiArray()).toEqual(keyPressure3);
  });

  it('should be able to generate cc.', () => {
    midi.reset('controlchange', cc3[1], cc3[2], 2);
    expect(midi.toMidiArray()).toEqual(cc3);
  });

  it('should be able to generate program change.', () => {
    midi.reset('programchange', programChange3[1], 0, 2);
    expect(midi.toMidiArray()).toEqual(programChange3);
  });

  it('should be able to generate channel pressure.', () => {
    midi.reset('channelpressure', channelPressure3[1], 0, 2);
    expect(midi.toMidiArray()).toEqual(channelPressure3);
  });

  it('should be able to generate pitch bend.', () => {
    midi.reset('pitchbend', pitchBendValue, 0, 2);
    expect(midi.toMidiArray()).toEqual(pitch3);
  });

  it('should be able to generate all sounds off.', () => {
    midi.reset('controlchange', allSoundsOff3[1], allSoundsOff3[2], 2);
    expect(midi.toMidiArray()).toEqual(allSoundsOff3);
  });

  it('should be able to generate reset all.', () => {
    midi.reset('controlchange', resetAll3[1], resetAll3[2], 2);
    expect(midi.toMidiArray()).toEqual(resetAll3);
  });

});
