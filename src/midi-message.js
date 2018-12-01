"use strict";

export const STATUS_BYTE = 0xf0;
export const CHANNEL_BYTE = 0x0f;
export const DATA_BYTE = 0x7f;

// Midi message names
export const MessageTypes = {
  NOTE_ON          : 'noteon',
  NOTE_OFF         : 'noteoff',
  KEY_PRESSURE     : 'keypressure',
  CC               : 'controlchange',
  PROGRAM_CHANGE   : 'programchange',
  CHANNEL_PRESSURE : 'channelpressure',
  PITCH_BEND       : 'pitchbend',
  UNKNOWN          : 'unknown'
}

const messageTypesList = Object.keys(MessageTypes)
  .map((key) => MessageTypes[key])
  .filter((key) => key !== 'unknow');

// CC mode names
export const CCModes = {
  ALL_SOUNDS_OFF      : 'allsoundsoff',
  RESET_ALL           : 'resetallcontrollers',
  LOCAL_CONTROLLER_OFF: 'localcontrolleroff',
  LOCAL_CONTROLLER_ON : 'localcontrolleron',
  ALL_NOTES_OFF       : 'allnotesoff',
  OMNI_OFF            : 'omnimodeoff',
  OMNI_ON             : 'omnimodeon', // Respond to all midi channels
  MONO_ON             : 'monomodeon',
  POLY_ON             : 'polymodeon'
}

// Status byte values that indicate the different midi notes
export const StatusBytes = {
  NOTE_OFF         : 0x80,
  NOTE_ON          : 0x90,
  KEY_PRESSURE     : 0xa0,
  CC               : 0xb0,
  PROGRAM_CHANGE   : 0xc0,
  CHANNEL_PRESSURE : 0xd0,
  PITCH_BEND       : 0xe0
}

// CC values that indicate special CC Modes.
export const CCModeValues = {
  ALL_SOUNDS_OFF   : 120,
  RESET_ALL        : 121,
  LOCAL_CONTROLLER : 122,
  ALL_NOTES_OFF    : 123,
  OMNI_OFF         : 124,
  OMNI_ON          : 125,
  MONO_ON          : 126,
  POLY_ON          : 127
}

export class MidiMessage {
  /*
   * There are a few ways to create a MidiMessage instance...
   *
   * As a note number:
   * `new MidiMessage(34)`
   *
   * Creates a 'noteon' midi message with the velocity set to 127.
   *
   * As parameters:
   * `new MidiMessage('noteon', 44, 120, 7, 1000)`
   *
   * - type = The midi message type. Must be one of the types
   *          defined by `MessageTypes` or "UNKNOWN" will be used.
   * - number = The note/cc number (if applicable).
   * - value = The velocity/pressure/program/bend/etc
   * - channel
   * - timestamp - millisecond delay before message should be played.
   *
   * As an object:
   * `new MidiMessage(oldMidiMessage)`
   *
   * It can be either another MidiMessage instance or an object
   * with similar properties.
   *
   * As an array:
   * `new MidiMessage([144, 60, 64])`
   *
   * The array data is expected to be raw midi data bytes as
   * expected by `MidiMessage.fromMidiArray()`;
   *
   *
   * However you pass the data, Values will always be clamped
   * to valid ranges with sensible defaults. Invalid parameters
   * will be replaced with the defaults as well.
   */
  constructor(type, number, value, channel, timestamp) {
    // Data Array
    if (Array.isArray(type)) {
      // If we passed a non-number string as the first value.
      if (typeof(type[0]) === 'string' && isNaN(Number(type[0]))) {
        this.reset(...type);
      }
      else {
        this.fromMidiArray(type, number);
      }
    }
    // MidiMessage
    else if (type instanceof Object) {
      this.copy(type);
    }
    // Midi Data Parameters
    else {
      // If we passed a number, rather than a string as the type,
      if (!isNaN(Number(type))) {
        // If we only passed one number,
        // treat it as a note number that we wish to send a note on for.
        if (arguments.length === 1) {
          this.reset('noteon', type);
        }
        // Otherwise, treat it like a raw midi array passed as parameters.
        else {
          this.fromMidiArray([type, number, value], channel);
        }
      }
      else {
        this.reset(type, number, value, channel, timestamp);
      }
    }
  }

  clampTo127(v) {
    return Math.max(0, Math.min(127, v)) || 0;
  }

  isValidType(t) {
    for (let i = 0; i < messageTypesList.length; i++) {
      if (t === messageTypesList[i]) {
        return true;
      }
    }

    return false;
  }

  setType(t) {
    if (this.isValidType(t)) {
      this.type = t;
    }
    else {
      // Special case because it's common to
      // use 'cc' rather than 'controlchange'
      if (t === 'cc') {
        this.type = MessageTypes.CC;
      }
      else {
        this.type = MessageTypes.UNKNOWN;
      }
    }
  }

  setTimestamp(t) {
    this.timestamp = Number(t);
    if (isNaN(this.timestamp)) this.timestamp = 0;
  }

  setChannel(c) {
    this.channel = Number(c);
    if (isNaN(this.channel) || this.channel < 0) this.channel = 0;
    else if (this.channel > 16) this.channel = 16;
  }

  setValue(v) {
    this.value = Number(v);
    if (isNaN(this.value)) this.value = 127;

    // If type is set, clamp value to the expected range.
    if (this.type && this.type !== MessageTypes.UNKNOWN) {
      switch(this.type) {
        case MessageTypes.NOTE_ON:
        case MessageTypes.NOTE_OFF:
        case MessageTypes.KEY_PRESSURE:
        case MessageTypes.CC:
        case MessageTypes.PROGRAM_CHANGE:
        case MessageTypes.CHANNEL_PRESSURE:
        case MessageTypes.PITCH_BEND:
          this.clampTo127(this.value);
          break;
      }
    }
  }

  setNumber(n) {
    this.number = Number(n);
    if (isNaN(this.number)) this.number = 0;
    this.clampTo127(this.value);
  }

  setVelocity(v) {
    this.setValue(v);
  }

  setNote(n) {
    this.setNumber(n);
  }

  setCC(c) {
    this.setNumber(c);
  }

  setPressure(p) {
    if (this.type === MessageTypes.KEY_PRESSURE) {
      this.setValue(p);
    }
    else {
      this.setNumber(p);
    }
  }

  setProgram(p) {
    this.setNumber(p);
  }

  setPitchbend(b) {
    this.setNumber(b);
  }

  reset(type, number, value, channel, timestamp) {
    this.setTimestamp(timestamp);
    this.setType(type);
    this.setChannel(channel);
    this.setNumber(number);
    this.setValue(value);

    this.ccMode = type === MessageTypes.CC ?
      this.parseChannelModeMessage(number, value) :
      false;

    this.disambiguate();

    return this;
  }

  /*
   * Add midi message specific values to the message object
   * to make it easier to use this object.
   */
  disambiguate() {
    // In case we changed the type,
    // clear out all of the custom properties.
    delete this.note;
    delete this.velocity;
    delete this.pressure;
    delete this.cc;
    delete this.program;
    delete this.pitchbend;

    if (this.type) {
      switch(this.type) {
        case MessageTypes.NOTE_ON:
        case MessageTypes.NOTE_OFF:
          this.note = this.number;
          this.velocity = this.value;
          break;
        case MessageTypes.KEY_PRESSURE:
          this.note = this.number;
          this.pressure = this.value;
          this.velocity = this.value;
          break;
        case MessageTypes.CC:
          this.cc = this.number;
          break;
        case MessageTypes.PROGRAM_CHANGE:
          this.program = this.number;
          break;
        case MessageTypes.CHANNEL_PRESSURE:
          this.pressure = this.number;
          this.velocity = this.number;
          break;
        case MessageTypes.PITCH_BEND:
          this.pitchbend = this.number;
          this.velocity = this.number;
          break;
      }
    }
  }

  // TODO API like var other = message.duplicate(overrides)
  duplicate(override) {
    return new MidiMessage(
      override.type      || this.type,
      override.number    || this.number,
      override.value     || this.value,
      override.channel   || this.channel,
      override.timestamp || this.timestamp
    );
  }

  copy(other, override) {
    return this.reset(
      override.type      || other.type,
      override.number    || other.number,
      override.value     || other.value,
      override.channel   || other.channel,
      override.timestamp || other.timestamp
    );
  }

  /*
   * Parse a MIDI Event from the browser.
   *
   * @see https://webaudio.github.io/web-midi-api/#MIDIMessageEvent
   */
  fromMidiEvent(event) {
    return this.fromMidiArray(event.data, event.timestamp);
  }

  /*
   * Parse a MIDI data array like `[144, 60, 23]`
   */
  fromMidiArray(data, timestamp = 0) {
    if (data && data.length < 2){
      console.warn("Illegal MIDI message of length", data.length);
      return;
    }

    const messageCode = data[0] & STATUS_BYTE;
    const channel = data[0] & CHANNEL_BYTE;
    let number = data[1] & DATA_BYTE;
    let value = data.length > 2 ? data[2] & DATA_BYTE : 0;
    let type;

    switch(messageCode){

      case StatusBytes.NOTE_OFF:
        type = MessageTypes.NOTE_OFF;
        value = 0;
        break;

      case StatusBytes.NOTE_ON:
        if (value === 0) {
          type = MessageTypes.NOTE_OFF;
        } else {
          type = MessageTypes.NOTE_ON;
        }
        break;

      case StatusBytes.KEY_PRESSURE:
        type = MessageTypes.KEY_PRESSURE;
        break;

      case StatusBytes.CC:
        type = MessageTypes.CC;
        break;

      case StatusBytes.PROGRAM_CHANGE:
        type = MessageTypes.PROGRAM_CHANGE;
        // TODO Is this supposed to be different?
        number = data[1];
        break;

      case StatusBytes.CHANNEL_PRESSURE:
        type = MessageTypes.CHANNEL_PRESSURE;
        break;

      case StatusBytes.PITCH_BEND:
        type = MessageTypes.PITCH_BEND;
        var msb = data[2] & DATA_BYTE;
        var lsb = data[1] & DATA_BYTE;
        // number = ((data[2] << 7) + data[1] - 8192) / 8192
        number = (msb << 8) + lsb;
        value = 0;
        break;

      // TODO SysEx, Clock, MTU
      default:
        type = MessageTypes.UNKNOWN;
        number = 0;
        value = 0;
        break;
    }

    return this.reset(
      type,
      number,
      value,
      channel,
      timestamp
    );
  }

  toMidiArray() {
    const out = [];

    out[0] = 0;
    if (!isNaN(this.number)) {
      out[1] = this.number;
    }
    if (!isNaN(this.value)) {
      out[2] = this.value;
    }

    switch(this.type){
      case MessageTypes.NOTE_OFF:
        out[0] = this.makeStatusByte(StatusBytes.NOTE_OFF, this.channel);
        break;

      case MessageTypes.NOTE_ON:
        out[0] = this.makeStatusByte(StatusBytes.NOTE_ON, this.channel);
        break;

      case MessageTypes.KEY_PRESSURE:
        out[0] = this.makeStatusByte(StatusBytes.KEY_PRESSURE, this.channel);
        break;

      case MessageTypes.CC:
        out[0] = this.makeStatusByte(StatusBytes.CC, this.channel);
        break;

      case MessageTypes.PROGRAM_CHANGE:
        out[0] = this.makeStatusByte(StatusBytes.PROGRAM_CHANGE, this.channel);
        out.length = 2;
        break;

      case MessageTypes.CHANNEL_PRESSURE:
        out[0] = this.makeStatusByte(StatusBytes.CHANNEL_PRESSURE, this.channel);
        out.length = 2;
        break;

      case MessageTypes.PITCH_BEND:
        out[0] = this.makeStatusByte(StatusBytes.PITCH_BEND, this.channel);
        out[1] =  this.number & 0x7F; // lsb
        out[2] = (this.number >> 8) & 0x7F; // msb
        // out[2] = (this.number & 0x3F80) >> 7; // msb
        break;

      // mtc, clock, song select, sysex
    }

    return out;
  }

  makeStatusByte(type, channel) {
    return type + channel;
  }

  /*
   * Given a cc note and value, determine if this is one
   * of the special CC Channel Mode Messages.
   *
   * @see https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
   * @see http://www.philrees.co.uk/articles/midimode.htm
   */
  parseChannelModeMessage(cc, value) {
    let mode = false;

    if (cc === CCModeValues.ALL_SOUNDS_OFF && value === 0){
      mode = CCModes.ALL_SOUNDS_OFF;
    }
    else if (cc === CCModeValues.RESET_ALL){
      mode = CCModes.RESET_ALL;
    }
    else if (cc === CCModeValues.LOCAL_CONTROLLER){
      if (value === 0){
        mode = CCModes.LOCAL_CONTROLLER_OFF;
      } else {
        mode = CCModes.LOCAL_CONTROLLER_ON;
      }
    }
    else if (cc === CCModeValues.ALL_NOTES_OFF && value === 0){
      mode = CCModes.ALL_NOTES_OFF;
    }
    else if (cc === CCModeValues.OMNI_OFF && value === 0){
      mode = CCModes.OMNI_OFF;
    }
    else if (cc === CCModeValues.OMNI_ON && value === 0){
      mode = CCModes.OMNI_ON;
    }
    else if (cc === CCModeValues.MONO_ON){
      // value corresponds to the number of voices
      mode = CCModes.MONO_ON;
    }
    else if (cc === CCModeValues.POLY_ON){
      mode = CCModes.POLY_ON;
    }

    return mode;
  }
}
