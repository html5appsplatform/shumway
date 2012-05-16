/* -*- mode: javascript; tab-width: 4; insert-tabs-mode: nil; indent-tabs-mode: nil -*- */

var RGB = {
  red: UI8,
  green: UI8,
  blue: UI8,
  alpha: '255'
};
var RGBA = {
  red: UI8,
  green: UI8,
  blue: UI8,
  alpha: UI8
};
var ARGB = {
  alpha: UI8,
  red: UI8,
  green: UI8,
  blue: UI8
};
var RECT = {
  $$0: ALIGN,
  $$bits: UB(5),
  xMin: SB('bits'),
  xMax: SB('bits'),
  yMin: SB('bits'),
  yMax: SB('bits'),
  $$1: ALIGN
};
var MATRIX = {
  $$0: ALIGN,
  $$hasScale: UB(1),
  $0: ['hasScale', [
    {
      $$bits: UB(5),
      scaleX: FB('bits'),
      scaleY: FB('bits')
    },
    {
      scaleX: '1',
      scaleY: '1'
    }
  ]],
  $$hasRotate: UB(1),
  $1: ['hasRotate', [
    {
      $$bits: UB(5),
      skew0: FB('bits'),
      skew1: FB('bits')
    },
    {
      skew0: '0',
      skew1: '0'
    }
  ]],
  $$bits: UB(5),
  translateX: SB('bits'),
  translateY: SB('bits'),
  $$1: ALIGN
};
var CXFORM = {
  $$0: ALIGN,
  $$hasAdd: UB(1),
  $$hasMult: UB(1),
  $$bits: UB(4),
  $0: ['hasMult', [
    {
      redMult: FB('bits'),
      greenMult: FB('bits'),
      blueMult: FB('bits'),
      alphaMult: ['tagCode>4', [FB('bits'), '1']]
    },
    {
      redMult: '1',
      greenMult: '1',
      blueMult: '1',
      alphaMult: '1'
    }
  ]],
  $1: ['hasAdd', [
    {
      redAdd: FB('bits'),
      greenAdd: FB('bits'),
      blueAdd: FB('bits'),
      alphaAdd: ['tagCode>4', [FB('bits'), '0']]
    },
    {
      redAdd: '0',
      greenAdd: '0',
      blueAdd: '0',
      alphaAdd: '0'
    }
  ]],
  $$1: ALIGN
};
var MOVIE_HEADER = {
  bounds: RECT,
  $$reserved: UI8,
  frameRate: UI8,
  frameCount: UI16
};
var EVENT = {
  $$flags: ['version>=6', [UI32, UI16]],
  $eoe: '!flags',
  keyUp: 'flags>>7&1',
  keyDown: 'flags>>6&1',
  mouseUp: 'flags>>5&1',
  mouseDown: 'flags>>4&1',
  mouseMove: 'flags>>3&1',
  unload: 'flags>>2&1',
  enterFrame: 'flags>>1&1',
  onload: 'flags&1',
  $0: ['version>=6', [
    {
      dragOver: 'flags>>15&1',
      rollOut: 'flags>>14&1',
      rollOver: 'flags>>13&1',
      releaseOutside: 'flags>>12&1',
      release: 'flags>>11&1',
      press: 'flags>>10&1',
      initialize: 'flags>>9&1',
      data: 'flags>>8&1',
      construct: ['version>=7', ['flags>>18&1', '0']],
      $keyPress: 'flags>>17&1',
      dragOut: 'flags>>16&1'
    }
  ]],
  $1: ['!eoe', [{
    $length: UI32,
    keyCode: ['keyPress', [UI8, null]],
    actionsData: BINARY('length - (keyPress ? 1 : 0)')
  }]]
};
var FILTER_GLOW = {
  $$count: ['type===4||type===7', [UI8, '1']],
  colors: {
    $: RGBA,
    count: 'count'
  },
  higlightColor: ['type===3', [RGBA]],
  $0: ['type===4||type===7', [{
    ratios: {
      $: UI8,
      count: 'count'
    }
  }]],
  blurX: FIXED,
  blurY: FIXED,
  $1: ['type!==2', [{
    angle: FIXED,
    distance: FIXED
  }]],
  strength: UB(1),
  innerShadow: UB(1),
  knockout: UB(1),
  $2: ['type===3', [
    { onTop: UB(1) },
    { $$reserved: UB(1) }
  ]],
  $3: ['type===4||type===7', [
    { passes: UB(4) },
    { $$reserved: UB(4) }
  ]]
};
var FILTER_BLUR = {
  blurX: FIXED,
  blurY: FIXED,
  passes: UB(5),
  $$reserved: UB(3)
};
var FILTER_CONVOLUTION = {
  columns: UI8,
  rows: UI8,
  divisor: FLOAT,
  bias: FLOAT,
  weights: {
    $: FLOAT,
    count: 'columns*rows'
  },
  defaultColor: RGBA,
  $$reserved: UB(6),
  clamp: UB(1),
  preserveAlpha: UB(1)
};
var FILTER_COLORMATRIX = {
  matrix: {
    $: FLOAT,
    count: 20
  }
};
var ANY_FILTER = {
  $type: UI8,
  $0: ['type', {
    0: FILTER_GLOW,
    1: FILTER_BLUR,
    2: FILTER_GLOW,
    3: FILTER_GLOW,
    4: FILTER_GLOW,
    5: FILTER_CONVOLUTION,
    6: FILTER_COLORMATRIX,
    7: FILTER_GLOW
  }]
};
var EXTERNAL = {
  objectId: UI16,
  symbolName: STRING
};
var PARAMS = {
  register: UI8,
  name: STRING
};
var FILL_SOLID = {
  color: ['tagCode>22||isMorph', [RGBA, RGB]],
  colorMorph: ['isMorph', [RGBA]]
};
var GRADIENT_RECORD = {
  ratio: UI8,
  color: ['tagCode>22', [RGBA, RGB]],
  $0: ['isMorph', [{
    ratioMorph: UI8,
    colorMorph: RGBA
  }]]
};
var GRADIENT = {
  $0: ['tagCode===83', [
    {
      spreadMode: UB(2),
      interpolationMode: UB(2)
    },
    { $$pad: UB(4) }
  ]],
  $count: UB(4),
  records: {
    $: GRADIENT_RECORD,
    count: 'count'
  },
  $1: ['type===19', [{
    focalPoint: FIXED8,
    focalPointMorph: ['isMorph', [FIXED8]]
  }]]
};
var FILL_GRADIENT = {
  matrix: MATRIX,
  matrixMorph: ['isMorph', [MATRIX]],
  $0: GRADIENT
};
var FILL_BITMAP = {
  bitmapId: UI16,
  matrix: MATRIX,
  matrixMorph: ['isMorph', [MATRIX]],
  condition: 'type===64||type===67'
};
var FILL_STYLE = {
  $type: UI8,
  $0: ['type', {
    0: FILL_SOLID,
    16: FILL_GRADIENT,
    18: FILL_GRADIENT,
    19: FILL_GRADIENT,
    64: FILL_BITMAP,
    65: FILL_BITMAP,
    66: FILL_BITMAP,
    67: FILL_BITMAP
  }]
};
var FILL_STYLE_ARRAY = {
  $$tmp: UI8,
  $$count: ['tagCode>2&&tmp===255', [UI16, 'tmp']],
  fillStyles: {
    $: FILL_STYLE,
    count: 'count'
  }
};
var LINE_STYLE = {
  width: UI16,
  widthMorph: ['isMorph', [UI16]],
  $0: ['hasStrokes', [
    {
      $$: ALIGN,
      startCapStyle: UB(2),
      $joinStyle: UB(2),
      $hasFill: UB(1),
      noHscale: UB(1),
      noVscale: UB(1),
      pixelHinting: UB(1),
      $$reserved: UB(5),
      noClose: UB(1),
      endCapStyle: UB(2),
      miterLimitFactor: ['joinStyle===2', [FIXED8]],
      $1: ['hasFill', [
        { fillStyle: FILL_STYLE },
        {
          color: RGBA,
          colorMorph: ['isMorph', [RGBA]]
        }
      ]]
    },
    {
      color: ['tagCode>22', [RGBA, RGB]],
      colorMorph: ['isMorph', [RGBA]]
    }
  ]]
};
var LINE_STYLE_ARRAY = {
  $$tmp: UI8,
  $$count: ['tagCode>2&&tmp===255', [UI16, 'tmp']],
  lineStyles: {
    $: LINE_STYLE,
    count: 'count'
  }
};
var STYLE_BITS = {
  $$: ALIGN,
  $$fillBits: UB(4),
  $$lineBits: UB(4)
};
var STYLES = {
  $0: FILL_STYLE_ARRAY,
  $1: LINE_STYLE_ARRAY,
  $2: STYLE_BITS
};
var SHAPE_RECORD_SETUP = {
  $hasNewStyles: ['tagCode>2', ['flags>>4', '0']],
  $hasLineStyle: 'flags>>3&1',
  $hasFillStyle1: 'flags>>2&1',
  $hasFillStyle0: 'flags>>1&1',
  $move: 'flags&1',
  $0: ['move', [{
    $$bits: UB(5),
    moveX: SB('bits'),
    moveY: SB('bits')
  }]],
  fillStyle0: ['hasFillStyle0', [UB('fillBits')]],
  fillStyle1: ['hasFillStyle1', [UB('fillBits')]],
  lineStyle: ['hasLineStyle', [UB('lineBits')]],
  $1: ['hasNewStyles', [STYLES]]
};
var SHAPE_RECORD_EDGE = {
  $isStraight: 'flags>>4',
  $$tmp: 'flags&0x0f',
  $$bits: 'tmp+2',
  $0: ['isStraight', [
    {
      $isGeneral: UB(1),
      $1: ['isGeneral', [
        {
          deltaX: SB('bits'),
          deltaY: SB('bits')
        },
        {
          $isVertical: UB(1),
          $2: ['isVertical', [
            { deltaY: SB('bits') },
            { deltaX: SB('bits') }
          ]]
        }
      ]]
    },
    {
      controlDeltaX: SB('bits'),
      controlDeltaY: SB('bits'),
      anchorDeltaX: SB('bits'),
      anchorDeltaY: SB('bits')
    }
  ]]
};
var SHAPE_RECORD = {
  $type: UB(1),
  $$flags: UB(5),
  $eos: '!(type||flags)',
  $0: ['type', [SHAPE_RECORD_EDGE, SHAPE_RECORD_SETUP]]
};
var SHAPE = {
  $0: STYLE_BITS,
  records: {
    $: SHAPE_RECORD,
    condition: '!eos'
  }
};
var SHAPE_WITH_STYLE = {
  $0: STYLES,
  records: {
    $: SHAPE_RECORD,
    condition: '!eos'
  }
};
var MORPH_SHAPE_WITH_STYLE = {
  $0: STYLES,
  records: {
    $: SHAPE_RECORD,
    condition: '!eos'
  },
  $1: STYLE_BITS,
  recordsMorph: {
    $: SHAPE_RECORD,
    condition: '!eos'
  }
};
var KERNING = {
  $0: ['wide', [
    {
      code1: UI16,
      code2: UI16
    },
    {
      code1: UI8,
      code2: UI8
    }
  ]],
  adjustment: UI16
};
var TEXT_ENTRY = {
  glyphIndex: UB('glyphBits'),
  advance: SB('advanceBits')
};
var TEXT_RECORD_SETUP = {
  $hasFont: 'flags>>3&1',
  $hasColor: 'flags>>2&1',
  $hasMoveY: 'flags>>1&1',
  $hasMoveX: 'flags&1',
  fontId: ['hasFont', [UI16]],
  $0: ['hasColor', [{ color: ['tagCode===33', [RGBA, RGB]] }]],
  moveX: ['hasMoveX', [SI16]],
  moveY: ['hasMoveY', [SI16]],
  fontHeight: ['hasFont', [UI16]]
};
var TEXT_RECORD = {
  $$: ALIGN, 
  $$flags: UB(8),
  $eot: '!flags',
  $0: TEXT_RECORD_SETUP,
  $1: ['!eot', [{
    $$tmp: UI8,
    $glyphCount: ['version>6', ['tmp', 'tmp&0x7f']],
    entries: {
      $: TEXT_ENTRY,
      count: 'glyphCount'
    }
  }]]
};
var ZONE_DATA = {
  coord: FLOAT16,
  range: FLOAT16
};
var ZONE_ARRAY = {
  $count: UI8,
  zoneData: {
    $: ZONE_DATA,
    count: 'count'
  },
  $$reserved: UB(6),
  zoneY: UB(1),
  zoneX: UB(1)
};
var ENVELOPE = {
  pos: UI32,
  volumeLeft: UI16,
  volumeRight: UI16
};
var SOUND_INFO = {
  soundId: UI16,
  $$reserved: UB(2),
  stop: UB(1),
  noMultiple: UB(1),
  $hasEnvelope: UB(1),
  $hasLoops: UB(1),
  $hasOutPoint: UB(1),
  $hasInPoint: UB(1),
  inPoint: ['hasInPoint', [UI32]],
  outPoint: ['hasInPoint', [UI32]],
  loopCount: ['hasLoopCount', [UI16]],
  $0: ['hasEnvelope', [{
    $envelopeCount: UI8,
    envelopes: {
      $: ENVELOPE,
      count: 'envelopeCount'
    }
  }]]
};
var BUTTON = {
  $$flags: UI8,
  $eob: '!flags',
  $0: ['version>=8', [
    {
      $blend: 'flags>>5&1',
      $hasFilters: 'flags>>4&1'
    },
    {
      $blend: '0',
      $hasFilters: '0'
    }
  ]],
  stateHitTest: 'flags>>3&1',
  stateDown: 'flags>>2&1',
  stateOver: 'flags>>1&1',
  stateUp: 'flags&1',
  $1: ['!eob', [{
    characterId: UI16,
    depth: UI16,
    matrix: MATRIX,
    cxform: ['tagCode===34', [CXFORM]],
    $2: ['hasFilters', [{
      filterCount: UI8,
      filters: ANY_FILTER
    }]],
    blendMode: ['blend', [UI8]]
  }]]
};
var BUTTONCONDACTION = {
  $$buttonCondSize: UI16,
  $$buttonConditions: UI16,
  idleToOverDown: 'buttonConditions>>7&1',
  outDownToIdle: 'buttonConditions>>6&1',
  outDownToOverDown: 'buttonConditions>>5&1',
  overDownToOutDown: 'buttonConditions>>4&1',
  overDownToOverUp: 'buttonConditions>>3&1',
  overUpToOverDown: 'buttonConditions>>2&1',
  overUpToIdle: 'buttonConditions>>1&1',
  idleToOverUp: 'buttonConditions&1',
  keyPress: 'buttonConditions>>9&127',
  overDownToIdle: 'buttonConditions>>8&1',
  actionsData: ['!buttonCondSize', [BINARY(0), BINARY('buttonCondSize - 4')]]
};
var CONDITION = {
  $$length: UI16,
  $0: ['length', [{
    key: UB(7),
    menuLeave: UB(1),
    menuEnter: UB(1),
    releaseOutside: UB(1),
    dragEnter: UB(1),
    dragLeave: UB(1),
    releaseInside: UB(1),
    push: UB(1),
    leave: UB(1),
    enter: UB(1),
    data: BINARY(0)
  }]]
};
