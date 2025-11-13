/***************** 
 * Untitled *
 * Финальная правка:
 * - importConditions(snapshot) теперь выбирает случайную строку из all_conditions
 *   соответствующую полю group, и импортирует её атрибуты (image, theme, tone, likes и т.д.).
 * - При установке картинки в trialRoutineBegin пробуем явные пути в папке /stimuli
 *   (и варианты с ресурсами/расширениями). Если ни один не сработал — ставим default.png.
 * - Логи добавлены для отладки (console.log / console.warn).
 *
 * Ожидание: в репозитории на сервере доступны файлы в каталоге /stimuli (относительно хоста),
 * и resources/all_conditions.csv содержит колонку 'group' и колонку 'image' с именем файла (например image1.png или image1).
 *****************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;


// store info about the experiment session:
let expName = 'untitled';  // from the Builder filename that created this script
let expInfo = {
    'participant': '',
};
const urlParams = util.getUrlParameters();
let PILOTING = Boolean(
  (urlParams && (urlParams.__pilotToken !== undefined)) ||
  (urlParams && (urlParams['__pilotToken'] !== undefined))
);

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([0,0,0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); },flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(instructionRoutineBegin());
flowScheduler.add(instructionRoutineEachFrame());
flowScheduler.add(instructionRoutineEnd());
const stimLoopLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(stimLoopLoopBegin(stimLoopLoopScheduler));
flowScheduler.add(stimLoopLoopScheduler);
flowScheduler.add(stimLoopLoopEnd);






flowScheduler.add(demosRoutineBegin());
flowScheduler.add(demosRoutineEachFrame());
flowScheduler.add(demosRoutineEnd());
flowScheduler.add(quizRoutineBegin());
flowScheduler.add(quizRoutineEachFrame());
flowScheduler.add(quizRoutineEnd());
flowScheduler.add(thanksRoutineBegin());
flowScheduler.add(thanksRoutineEachFrame());
flowScheduler.add(thanksRoutineEnd());
flowScheduler.add(quitPsychoJS, 'Thank you for your patience.', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your patience.', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    // default для надёжности
    {'name': 'default.png', 'path': 'https://pavlovia.org/assets/default/default.png'},
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.INFO);


var currentLoop;
var frameDur;

/* -------------------------
   CSV utilities
   ------------------------- */
async function loadConditions(path='resources/all_conditions.csv') {
  try {
    const resp = await fetch(path, {cache: 'no-store'});
    if (!resp.ok) {
      console.warn('loadConditions: fetch failed', path, resp.status, resp.statusText);
      return [];
    }
    const text = await resp.text();
    return parseCSV(text);
  } catch (err) {
    console.error('loadConditions: error fetching', path, err);
    return [];
  }
}

function parseCSV(text) {
  const rows = text.replace(/\r/g, '').split('\n').filter(r => r.trim().length > 0);
  if (rows.length === 0) return [];
  const headers = splitCSVLine(rows[0]);
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const fields = splitCSVLine(rows[i]);
    while (fields.length < headers.length) fields.push('');
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = fields[j];
    }
    data.push(obj);
  }
  return data;
}

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i+1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  result.push(cur);
  return result;
}
/* -------------------------
   End CSV utilities
   ------------------------- */


async function updateInfo() {
  currentLoop = psychoJS.experiment;  // right now there are no loops
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;


  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  

  
  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = ',';


  return Scheduler.Event.NEXT;
}
// Begin Experiment

// глобальные переменные
var selected_groups = [1,2,3,4,5,6,7,8,9]; // порядок групп для показа
var all_conditions = []; // загружается в experimentInit через fetch
var image = '';
var theme = '';
var tone = '';
var likes = '';
var group = '';       // текущая группа (число или строка)
var group_rows;
var chosen_row;

var instructionClock;
var instr;
var instr_enter;
var trialClock;
var postImg;
var survey0Clock;
var q0;
var emotionality;
var survey1Clock;
var q1;
var useful;
var survey2Clock;
var q2;
var cred;
var survey3Clock;
var q3;
var share;
var demosClock;
var q_age;
var ageBox;
var q_gender;
var genderBox;
var q_platform;
var platformBox;
var q_hours;
var hoursBox;
var button;
var quizClock;
var q_final;
var button_yes;
var button_no;
var thanksClock;
var thank_you;
var thanks_enter;
var globalClock;
var routineTimer;
async function experimentInit() {
  // Загружаем CSV с условиями до создания петли stimLoop
  all_conditions = await loadConditions('resources/all_conditions.csv');
  if (!all_conditions || all_conditions.length === 0) {
    console.warn('experimentInit: all_conditions is empty or failed to load. stimLoop will be empty.');
  } else {
    console.log(`experimentInit: loaded ${all_conditions.length} condition rows.`);
  }

  // Initialize components for Routine "instruction"
  instructionClock = new util.Clock();
  instr = new visual.TextStim({
    win: psychoJS.window,
    name: 'instr',
    text: 'ИНФОРМИРОВАННОЕ СОГЛАСИЕ НА УЧАСТИЕ В ИССЛЕДОВАНИИ\n\nЗдравствуйте!\n\nСпасибо, что принимаете участие в исследовании.\n\nНажмите пробел чтобы продолжить.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.02,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  instr_enter = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "trial"
  trialClock = new util.Clock();
  
  postImg = new visual.ImageStim({
    win : psychoJS.window,
    name : 'postImg', units : undefined, 
    anchor : 'center',
    ori : 0.0, 
    pos : [0, 0], 
    draggable: false,
    size : [1.3, 0.5],
    color : new util.Color([1,1,1]), opacity : undefined,
    flipHoriz : false, flipVert : false,
    texRes : 128.0, interpolate : true, depth : -1.0 
  });
    
  // Initialize components for other routines (survey0..thanks)...
  // (оставляем как есть, не меняются)

  survey0Clock = new util.Clock();
  q0 = new visual.TextStim({
    win: psychoJS.window,
    name: 'q0',
    text: 'Оцените эмоциональность поста?',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  emotionality = new visual.Slider({
    win: psychoJS.window, name: 'emotionality',
    startValue: undefined,
    size: [1.0, 0.1], pos: [0, (- 0.1)], ori: 0.0, units: psychoJS.window.units,
    labels: ["Негативный", "Нейтральный", "Позитивный"],
    granularity: 1.0, style: ["RATING"],
    color: new util.Color('LightGray'), markerColor: new util.Color('Red'), lineColor: new util.Color('White'), 
    opacity: undefined, fontFamily: 'Noto Sans', bold: true, italic: false, depth: -2, 
    flip: false,
  });

  // ... остальные инициализации (survey1, survey2, demos, quiz, thanks)
  // для сокращения вывода пропущены — в вашем исходном файле они уже есть и не менялись.

  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}


var t;
var frameN;
var continueRoutine;
var routineForceEnded;
var instructionMaxDurationReached;
var _instr_enter_allKeys;
var instructionMaxDuration;
var instructionComponents;
function instructionRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'instruction' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    instructionClock.reset();
    routineTimer.reset();
    instructionMaxDurationReached = false;
    // update component parameters for each repeat
    instr_enter.keys = undefined;
    instr_enter.rt = undefined;
    _instr_enter_allKeys = [];
    instructionMaxDuration = null
    // keep track of which components have finished
    instructionComponents = [];
    instructionComponents.push(instr);
    instructionComponents.push(instr_enter);
    
    for (const thisComponent of instructionComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function instructionRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'instruction' ---
    // get current time
    t = instructionClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *instr* updates
    if (t >= 0.0 && instr.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      instr.tStart = t;  // (not accounting for frame time here)
      instr.frameNStart = frameN;  // exact frame index
      
      instr.setAutoDraw(true);
    }
    
    
    // if instr is active this frame...
    if (instr.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *instr_enter* updates
    if (t >= 0.0 && instr_enter.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      instr_enter.tStart = t;  // (not accounting for frame time here)
      instr_enter.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { instr_enter.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { instr_enter.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { instr_enter.clearEvents(); });
    }
    
    // if instr_enter is active this frame...
    if (instr_enter.status === PsychoJS.Status.STARTED) {
      let theseKeys = instr_enter.getKeys({keyList: 'space', waitRelease: false});
      _instr_enter_allKeys = _instr_enter_allKeys.concat(theseKeys);
      if (_instr_enter_allKeys.length > 0) {
        instr_enter.keys = _instr_enter_allKeys[_instr_enter_allKeys.length - 1].name;  // just the last key pressed
        instr_enter.rt = _instr_enter_allKeys[_instr_enter_allKeys.length - 1].rt;
        instr_enter.duration = _instr_enter_allKeys[_instr_enter_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of instructionComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function instructionRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'instruction' ---
    for (const thisComponent of instructionComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    instr_enter.stop();
    // the Routine "instruction" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var stimLoop;
function stimLoopLoopBegin(stimLoopLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // Здесь мы хотим итерировать по выбранным группам (selected_groups),
    // в каждой итерации выбирать случайную строку из all_conditions для этой группы.
    // Для этого создаём trialList, содержащий только объекты с полем group.
    const groupTrialList = selected_groups.map(g => ({group: g}));
    stimLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: groupTrialList,
      seed: undefined, name: 'stimLoop'
    });
    psychoJS.experiment.addLoop(stimLoop); // add the loop to the experiment
    currentLoop = stimLoop;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisStimLoop of stimLoop) {
      snapshot = stimLoop.getSnapshot();
      stimLoopLoopScheduler.add(importConditions(snapshot));
      stimLoopLoopScheduler.add(trialRoutineBegin(snapshot));
      stimLoopLoopScheduler.add(trialRoutineEachFrame());
      stimLoopLoopScheduler.add(trialRoutineEnd(snapshot));
      stimLoopLoopScheduler.add(survey0RoutineBegin(snapshot));
      stimLoopLoopScheduler.add(survey0RoutineEachFrame());
      stimLoopLoopScheduler.add(survey0RoutineEnd(snapshot));
      stimLoopLoopScheduler.add(survey1RoutineBegin(snapshot));
      stimLoopLoopScheduler.add(survey1RoutineEachFrame());
      stimLoopLoopScheduler.add(survey1RoutineEnd(snapshot));
      stimLoopLoopScheduler.add(survey2RoutineBegin(snapshot));
      stimLoopLoopScheduler.add(stimLoopLoopEndIteration(stimLoopLoopScheduler, snapshot)); // end-iteration check
    }
    
    return Scheduler.Event.NEXT;
  }
}


async function stimLoopLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(stimLoop);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}


function stimLoopLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      }
    return Scheduler.Event.NEXT;
    }
  };
}


/* -------------------------
   Core: importConditions
   - Для текущего snapshot (который содержит поле group) выбирает
     случайную строку из all_conditions с тем же group и импортирует её поля.
   - Устанавливает глобальные переменные image, theme, tone, likes и group.
   ------------------------- */
function importConditions(snapshot) {
  return async function () {
    // snapshot может быть объектом с полем group (мы создали trialList как [{group:1}, ...])
    let trialAttrs = null;
    if (typeof snapshot !== 'undefined' && snapshot !== null) {
      // snapshot может быть plain object или объект-обёртка TrialHandlerSnapshot
      if (snapshot.group !== undefined) {
        trialAttrs = snapshot;
      } else if (typeof snapshot.getCurrentTrial === 'function') {
        // builder-style snapshot
        trialAttrs = snapshot.getCurrentTrial();
      } else {
        // попытка использовать snapshot как объект с keys
        try {
          trialAttrs = snapshot;
        } catch (e) {
          trialAttrs = null;
        }
      }
    }

    // Получаем номер/имя группы из snapshot
    let thisGroup = undefined;
    if (trialAttrs && trialAttrs.group !== undefined) {
      thisGroup = trialAttrs.group;
    } else if (trialAttrs && trialAttrs['group']) {
      thisGroup = trialAttrs['group'];
    } else {
      // fallback: если у нас есть stimLoop.thisN, используем индекс selected_groups
      if (typeof stimLoop !== 'undefined' && typeof stimLoop.thisN !== 'undefined') {
        thisGroup = selected_groups[stimLoop.thisN];
      }
    }

    group = thisGroup;
    console.log('importConditions: requested group =', group);

    // Найдём все строки CSV с нужной группой (учитываем, что в CSV group может быть строкой)
    if (all_conditions && all_conditions.length > 0 && typeof group !== 'undefined' && group !== null) {
      // сопоставим по строковому представлению для надёжности
      const gstr = String(group).trim();
      const rows = all_conditions.filter(r => String(r.group).trim() === gstr);
      if (rows.length === 0) {
        console.warn('importConditions: no rows found for group', group, ' — falling back to all rows.');
        // Если ничего не найдено, можно использовать весь список
        chosen_row = all_conditions[Math.floor(Math.random() * all_conditions.length)];
      } else {
        chosen_row = rows[Math.floor(Math.random() * rows.length)];
      }
    } else {
      console.warn('importConditions: all_conditions empty or group undefined; choosing random row from all_conditions if any.');
      if (all_conditions && all_conditions.length > 0) {
        chosen_row = all_conditions[Math.floor(Math.random() * all_conditions.length)];
      } else {
        chosen_row = null;
      }
    }

    if (chosen_row) {
      // Импортируем атрибуты в пространство имён PsychoJS (как делает Builder)
      try {
        psychoJS.importAttributes(chosen_row);
      } catch (e) {
        // В простейшем случае назначаем глобальные переменные вручную
      }
      // Назначим глобальные переменные вручную для удобства
      image = (chosen_row.image !== undefined) ? chosen_row.image : (chosen_row.Image || '');
      theme = (chosen_row.theme !== undefined) ? chosen_row.theme : (chosen_row.Theme || '');
      tone  = (chosen_row.tone !== undefined) ? chosen_row.tone : (chosen_row.Tone || '');
      likes = (chosen_row.likes !== undefined) ? chosen_row.likes : (chosen_row.Likes || '');
      console.log('importConditions: chosen_row for group', group, chosen_row);
    } else {
      image = ''; theme = ''; tone = ''; likes = '';
      console.warn('importConditions: chosen_row is null — no stimulus data available.');
    }

    return Scheduler.Event.NEXT;
  };
}
/* -------------------------
   Конец importConditions
   ------------------------- */


var trialMaxDurationReached;
var trialMaxDuration;
var trialComponents;
function trialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'trial' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    trialClock.reset(routineTimer.getTime());
    routineTimer.add(10.000000);
    trialMaxDurationReached = false;

    // Если это 9-й цикл (индексация с 0), останавливаем петлю и рутину
    if (typeof stimLoop !== 'undefined' && stimLoop.thisN === 9) {
        stimLoop.finished = true;
        continueRoutine = false;
    }

    // image, theme, tone, likes должны быть установлены importConditions
    image = (typeof image !== 'undefined' && image !== null) ? image : '';
    theme = (typeof theme !== 'undefined' && theme !== null) ? theme : '';
    tone  = (typeof tone !== 'undefined' && tone !== null) ? tone : '';
    likes = (typeof likes !== 'undefined' && likes !== null) ? likes : '';

    console.log('trialRoutineBegin: group=', group, 'image field=', image, 'chosen_row=', chosen_row);

    // Сформируем список вариантов путей к стимулу в папке /stimuli
    const tryPaths = [];
    if (image && image !== '') {
      const trimmed = String(image).trim();
      // если image уже содержит абсолютный URL или путь — попробуем как есть первым
      tryPaths.push(trimmed);
      // если image — относительное имя (без слешей), пробуем в папке stimuli
      let base = trimmed.replace(/^\.\//, '');
      if (!base.includes('/')) {
        // пробуем варианты в /stimuli и resources/stimuli
        tryPaths.push(`stimuli/${base}`);
        tryPaths.push(`resources/stimuli/${base}`);
        tryPaths.push(`/stimuli/${base}`);
        tryPaths.push(`images/${base}`);
        tryPaths.push(`resources/${base}`);
        // если нет расширения, добавим .png/.jpg/.jpeg
        if (!/\.[a-zA-Z0-9]+$/.test(base)) {
          ['png','jpg','jpeg'].forEach(ext => {
            tryPaths.push(`stimuli/${base}.${ext}`);
            tryPaths.push(`resources/stimuli/${base}.${ext}`);
            tryPaths.push(`/stimuli/${base}.${ext}`);
            tryPaths.push(`images/${base}.${ext}`);
          });
        }
      } else {
        // если содержится путь, пробуем относительный к resources и как есть
        tryPaths.push(`resources/${base}`);
        tryPaths.push(base);
      }
    }

    // Добавим в конце default.png запасной вариант
    tryPaths.push('default.png');

    // Попытка установить первое корректное изображение
    let applied = false;
    for (const p of tryPaths) {
      try {
        postImg.setImage(p);
        applied = true;
        if (p !== image) {
          console.warn('postImg: used fallback path:', p, 'original image field:', image);
        } else {
          console.log('postImg: using image', p);
        }
        break;
      } catch (err) {
        console.warn('postImg.setImage failed for', p, err);
      }
    }
    if (!applied) {
      console.error('postImg: failed to set any image (including default). postImg remains blank.');
    }

    trialMaxDuration = null
    // keep track of which components have finished
    trialComponents = [];
    trialComponents.push(postImg);
    
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


var frameRemains;
function trialRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'trial' ---
    // get current time
    t = trialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *postImg* updates
    if (t >= 0.0 && postImg.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      postImg.tStart = t;  // (not accounting for frame time here)
      postImg.frameNStart = frameN;  // exact frame index
      
      postImg.setAutoDraw(true);
    }
    
    
    // if postImg is active this frame...
    if (postImg.status === PsychoJS.Status.STARTED) {
    }
    
    frameRemains = 0.0 + 10.0 - psychoJS.window.monitorFramePeriod * 0.75;// most of one frame period left
    if (postImg.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      // keep track of stop time/frame for later
      postImg.tStop = t;  // not accounting for scr refresh
      postImg.frameNStop = frameN;  // exact frame index
      // update status
      postImg.status = PsychoJS.Status.FINISHED;
      postImg.setAutoDraw(false);
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine && routineTimer.getTime() > 0) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}
    
    //--- Prepare to start Routine 'survey0' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    survey0Clock.reset();
    routineTimer.reset();
    survey0MaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from code0
    if (typeof stimLoop !== 'undefined' && stimLoop.thisN === 9) {
        stimLoop.finished = true;
        continueRoutine = false;
    }
    emotionality.reset()
    psychoJS.experiment.addData('survey0.started', globalClock.getTime());
    survey0MaxDuration = null
    // keep track of which components have finished
    survey0Components = [];
    survey0Components.push(q0);
    survey0Components.push(emotionality);
    
    for (const thisComponent of survey0Components)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function survey0RoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'survey0' ---
    // get current time
    t = survey0Clock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q0* updates
    if (t >= 0.0 && q0.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q0.tStart = t;  // (not accounting for frame time here)
      q0.frameNStart = frameN;  // exact frame index
      
      q0.setAutoDraw(true);
    }
    
    
    // if q0 is active this frame...
    if (q0.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *emotionality* updates
    if (t >= 0.0 && emotionality.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      emotionality.tStart = t;  // (not accounting for frame time here)
      emotionality.frameNStart = frameN;  // exact frame index
      
      emotionality.setAutoDraw(true);
    }
    
    
    // if emotionality is active this frame...
    if (emotionality.status === PsychoJS.Status.STARTED) {
    }
    
    
    // Check emotionality for response to end Routine
    if (emotionality.getRating() !== undefined && emotionality.status === PsychoJS.Status.STARTED) {
      continueRoutine = false; }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of survey0Components)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function survey0RoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'survey0' ---
    for (const thisComponent of survey0Components) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('survey0.stopped', globalClock.getTime());
    // the Routine "survey0" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var survey1MaxDurationReached;
var survey1MaxDuration;
var survey1Components;
function survey1RoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'survey1' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    survey1Clock.reset();
    routineTimer.reset();
    survey1MaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from code_2
    if (typeof stimLoop !== 'undefined' && stimLoop.thisN === 9) {
        stimLoop.finished = true;
        continueRoutine = false;
    }
    useful.reset()
    survey1MaxDuration = null
    // keep track of which components have finished
    survey1Components = [];
    survey1Components.push(q1);
    survey1Components.push(useful);
    
    for (const thisComponent of survey1Components)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function survey1RoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'survey1' ---
    // get current time
    t = survey1Clock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q1* updates
    if (t >= 0.0 && q1.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q1.tStart = t;  // (not accounting for frame time here)
      q1.frameNStart = frameN;  // exact frame index
      
      q1.setAutoDraw(true);
    }
    
    
    // if q1 is active this frame...
    if (q1.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *useful* updates
    if (t >= 0.0 && useful.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      useful.tStart = t;  // (not accounting for frame time here)
      useful.frameNStart = frameN;  // exact frame index
      
      useful.setAutoDraw(true);
    }
    
    
    // if useful is active this frame...
    if (useful.status === PsychoJS.Status.STARTED) {
    }
    
    
    // Check useful for response to end Routine
    if (useful.getRating() !== undefined && useful.status === PsychoJS.Status.STARTED) {
      continueRoutine = false; }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of survey1Components)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function survey1RoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'survey1' ---
    for (const thisComponent of survey1Components) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // the Routine "survey1" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var survey2MaxDurationReached;
var survey2MaxDuration;
var survey2Components;
function survey2RoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'survey2' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    survey2Clock.reset();
    routineTimer.reset();
    survey2MaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from code_3
    if (typeof stimLoop !== 'undefined' && stimLoop.thisN === 9) {
        stimLoop.finished = true;
        continueRoutine = false;
    }
    cred.reset()
    survey2MaxDuration = null
    // keep track of which components have finished
    survey2Components = [];
    survey2Components.push(q2);
    survey2Components.push(cred);
    
    for (const thisComponent of survey2Components)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function survey2RoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'survey2' ---
    // get current time
    t = survey2Clock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q2* updates
    if (t >= 0.0 && q2.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q2.tStart = t;  // (not accounting for frame time here)
      q2.frameNStart = frameN;  // exact frame index
      
      q2.setAutoDraw(true);
    }
    
    
    // if q2 is active this frame...
    if (q2.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *cred* updates
    if (t >= 0.0 && cred.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      cred.tStart = t;  // (not accounting for frame time here)
      cred.frameNStart = frameN;  // exact frame index
      
      cred.setAutoDraw(true);
    }
    
    
    // if cred is active this frame...
    if (cred.status === PsychoJS.Status.STARTED) {
    }
    
    
    // Check cred for response to end Routine
    if (cred.getRating() !== undefined && cred.status === PsychoJS.Status.STARTED) {
      continueRoutine = false; }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of survey2Components)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function survey2RoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'survey2' ---
    for (const thisComponent of survey2Components) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // the Routine "survey2" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var survey3MaxDurationReached;
var survey3MaxDuration;
var survey3Components;
function survey3RoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'survey3' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    survey3Clock.reset();
    routineTimer.reset();
    survey3MaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from code_4
    if (typeof stimLoop !== 'undefined' && stimLoop.thisN === 9) {
        stimLoop.finished = true;
        continueRoutine = false;
    }
    share.reset()
    survey3MaxDuration = null
    // keep track of which components have finished
    survey3Components = [];
    survey3Components.push(q3);
    survey3Components.push(share);
    
    for (const thisComponent of survey3Components)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function survey3RoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'survey3' ---
    // get current time
    t = survey3Clock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q3* updates
    if (t >= 0.0 && q3.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q3.tStart = t;  // (not accounting for frame time here)
      q3.frameNStart = frameN;  // exact frame index
      
      q3.setAutoDraw(true);
    }
    
    
    // if q3 is active this frame...
    if (q3.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *share* updates
    if (t >= 0.0 && share.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      share.tStart = t;  // (not accounting for frame time here)
      share.frameNStart = frameN;  // exact frame index
      
      share.setAutoDraw(true);
    }
    
    
    // if share is active this frame...
    if (share.status === PsychoJS.Status.STARTED) {
    }
    
    
    // Check share for response to end Routine
    if (share.getRating() !== undefined && share.status === PsychoJS.Status.STARTED) {
      continueRoutine = false; }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of survey3Components)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function survey3RoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'survey3' ---
    for (const thisComponent of survey3Components) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // the Routine "survey3" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var demosMaxDurationReached;
var demosMaxDuration;
var demosComponents;
function demosRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'demos' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    demosClock.reset();
    routineTimer.reset();
    demosMaxDurationReached = false;
    // update component parameters for each repeat
    ageBox.setText('');
    ageBox.refresh();
    genderBox.setText('');
    genderBox.refresh();
    platformBox.setText('');
    platformBox.refresh();
    hoursBox.setText('');
    hoursBox.refresh();
    // reset button to account for continued clicks & clear times on/off
    button.reset()
    demosMaxDuration = null
    // keep track of which components have finished
    demosComponents = [];
    demosComponents.push(q_age);
    demosComponents.push(ageBox);
    demosComponents.push(q_gender);
    demosComponents.push(genderBox);
    demosComponents.push(q_platform);
    demosComponents.push(platformBox);
    demosComponents.push(q_hours);
    demosComponents.push(hoursBox);
    demosComponents.push(button);
    
    for (const thisComponent of demosComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function demosRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'demos' ---
    // get current time
    t = demosClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q_age* updates
    if (t >= 0.0 && q_age.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q_age.tStart = t;  // (not accounting for frame time here)
      q_age.frameNStart = frameN;  // exact frame index
      
      q_age.setAutoDraw(true);
    }
    
    
    // if q_age is active this frame...
    if (q_age.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *ageBox* updates
    if (t >= 0.0 && ageBox.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      ageBox.tStart = t;  // (not accounting for frame time here)
      ageBox.frameNStart = frameN;  // exact frame index
      
      ageBox.setAutoDraw(true);
    }
    
    
    // if ageBox is active this frame...
    if (ageBox.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *q_gender* updates
    if (t >= 0.0 && q_gender.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q_gender.tStart = t;  // (not accounting for frame time here)
      q_gender.frameNStart = frameN;  // exact frame index
      
      q_gender.setAutoDraw(true);
    }
    
    
    // if q_gender is active this frame...
    if (q_gender.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *genderBox* updates
    if (t >= 0.0 && genderBox.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      genderBox.tStart = t;  // (not accounting for frame time here)
      genderBox.frameNStart = frameN;  // exact frame index
      
      genderBox.setAutoDraw(true);
    }
    
    
    // if genderBox is active this frame...
    if (genderBox.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *q_platform* updates
    if (t >= 0.0 && q_platform.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q_platform.tStart = t;  // (not accounting for frame time here)
      q_platform.frameNStart = frameN;  // exact frame index
      
      q_platform.setAutoDraw(true);
    }
    
    
    // if q_platform is active this frame...
    if (q_platform.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *platformBox* updates
    if (t >= 0.0 && platformBox.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      platformBox.tStart = t;  // (not accounting for frame time here)
      platformBox.frameNStart = frameN;  // exact frame index
      
      platformBox.setAutoDraw(true);
    }
    
    
    // if platformBox is active this frame...
    if (platformBox.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *q_hours* updates
    if (t >= 0.0 && q_hours.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q_hours.tStart = t;  // (not accounting for frame time here)
      q_hours.frameNStart = frameN;  // exact frame index
      
      q_hours.setAutoDraw(true);
    }
    
    
    // if q_hours is active this frame...
    if (q_hours.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *hoursBox* updates
    if (t >= 0.0 && hoursBox.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      hoursBox.tStart = t;  // (not accounting for frame time here)
      hoursBox.frameNStart = frameN;  // exact frame index
      
      hoursBox.setAutoDraw(true);
    }
    
    
    // if hoursBox is active this frame...
    if (hoursBox.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *button* updates
    if (t >= 0 && button.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      button.tStart = t;  // (not accounting for frame time here)
      button.frameNStart = frameN;  // exact frame index
      
      button.setAutoDraw(true);
    }
    
    
    // if button is active this frame...
    if (button.status === PsychoJS.Status.STARTED) {
    }
    
    if (button.status === PsychoJS.Status.STARTED) {
      // check whether button has been pressed
      if (button.isClicked) {
        if (!button.wasClicked) {
          // store time of first click
          button.timesOn.push(button.clock.getTime());
          // store time clicked until
          button.timesOff.push(button.clock.getTime());
        } else {
          // update time clicked until;
          button.timesOff[button.timesOff.length - 1] = button.clock.getTime();
        }
        if (!button.wasClicked) {
          // end routine when button is clicked
          continueRoutine = false;
          
        }
        // if button is still clicked next frame, it is not a new click
        button.wasClicked = true;
      } else {
        // if button is clicked next frame, it is a new click
        button.wasClicked = false;
      }
    } else {
      // keep clock at 0 if button hasn't started / has finished
      button.clock.reset();
      // if button is clicked next frame, it is a new click
      button.wasClicked = false;
    }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of demosComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function demosRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'demos' ---
    for (const thisComponent of demosComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('ageBox.text',ageBox.text)
    psychoJS.experiment.addData('genderBox.text',genderBox.text)
    psychoJS.experiment.addData('platformBox.text',platformBox.text)
    psychoJS.experiment.addData('hoursBox.text',hoursBox.text)
    psychoJS.experiment.addData('button.numClicks', button.numClicks);
    psychoJS.experiment.addData('button.timesOn', button.timesOn);
    psychoJS.experiment.addData('button.timesOff', button.timesOff);
    // Run 'End Routine' code from code_9
    psychoJS.experiment.addData('age', ageBox.text);
    psychoJS.experiment.addData('gender', genderBox.text);
    psychoJS.experiment.addData('platform', platformBox.text);
    psychoJS.experiment.addData('hours', hoursBox.text);
    // the Routine "demos" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var quizMaxDurationReached;
var quizMaxDuration;
var quizComponents;
function quizRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'quiz' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    quizClock.reset();
    routineTimer.reset();
    quizMaxDurationReached = false;
    // update component parameters for each repeat
    // reset button_yes to account for continued clicks & clear times on/off
    button_yes.reset()
    // reset button_no to account for continued clicks & clear times on/off
    button_no.reset()
    quizMaxDuration = null
    // keep track of which components have finished
    quizComponents = [];
    quizComponents.push(q_final);
    quizComponents.push(button_yes);
    quizComponents.push(button_no);
    
    for (const thisComponent of quizComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function quizRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'quiz' ---
    // get current time
    t = quizClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *q_final* updates
    if (t >= 0.0 && q_final.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      q_final.tStart = t;  // (not accounting for frame time here)
      q_final.frameNStart = frameN;  // exact frame index
      
      q_final.setAutoDraw(true);
    }
    
    
    // if q_final is active this frame...
    if (q_final.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *button_yes* updates
    if (t >= 0 && button_yes.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      button_yes.tStart = t;  // (not accounting for frame time here)
      button_yes.frameNStart = frameN;  // exact frame index
      
      button_yes.setAutoDraw(true);
    }
    
    
    // if button_yes is active this frame...
    if (button_yes.status === PsychoJS.Status.STARTED) {
    }
    
    if (button_yes.status === PsychoJS.Status.STARTED) {
      // check whether button_yes has been pressed
      if (button_yes.isClicked) {
        if (!button_yes.wasClicked) {
          // store time of first click
          button_yes.timesOn.push(button_yes.clock.getTime());
          // store time clicked until
          button_yes.timesOff.push(button_yes.clock.getTime());
        } else {
          // update time clicked until;
          button_yes.timesOff[button_yes.timesOff.length - 1] = button_yes.clock.getTime();
        }
        if (!button_yes.wasClicked) {
          // end routine when button_yes is clicked
          continueRoutine = false;
          
        }
        // if button_yes is still clicked next frame, it is not a new click
        button_yes.wasClicked = true;
      } else {
        // if button_yes is clicked next frame, it is a new click
        button_yes.wasClicked = false;
      }
    } else {
      // keep clock at 0 if button_yes hasn't started / has finished
      button_yes.clock.reset();
      // if button_yes is clicked next frame, it is a new click
      button_yes.wasClicked = false;
    }
    
    // *button_no* updates
    if (t >= 0 && button_no.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      button_no.tStart = t;  // (not accounting for frame time here)
      button_no.frameNStart = frameN;  // exact frame index
      
      button_no.setAutoDraw(true);
    }
    
    
    // if button_no is active this frame...
    if (button_no.status === PsychoJS.Status.STARTED) {
    }
    
    if (button_no.status === PsychoJS.Status.STARTED) {
      // check whether button_no has been pressed
      if (button_no.isClicked) {
        if (!button_no.wasClicked) {
          // store time of first click
          button_no.timesOn.push(button_no.clock.getTime());
          // store time clicked until
          button_no.timesOff.push(button_no.clock.getTime());
        } else {
          // update time clicked until;
          button_no.timesOff[button_no.timesOff.length - 1] = button_no.clock.getTime();
        }
        if (!button_no.wasClicked) {
          // end routine when button_no is clicked
          continueRoutine = false;
          
        }
        // if button_no is still clicked next frame, it is not a new click
        button_no.wasClicked = true;
      } else {
        // if button_no is clicked next frame, it is a new click
        button_no.wasClicked = false;
      }
    } else {
      // keep clock at 0 if button_no hasn't started / has finished
      button_no.clock.reset();
      // if button_no is clicked next frame, it is a new click
      button_no.wasClicked = false;
    }
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of quizComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function quizRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'quiz' ---
    for (const thisComponent of quizComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('button_yes.numClicks', button_yes.numClicks);
    psychoJS.experiment.addData('button_yes.timesOn', button_yes.timesOn);
    psychoJS.experiment.addData('button_yes.timesOff', button_yes.timesOff);
    psychoJS.experiment.addData('button_no.numClicks', button_no.numClicks);
    psychoJS.experiment.addData('button_no.timesOn', button_no.timesOn);
    psychoJS.experiment.addData('button_no.timesOff', button_no.timesOff);
    // the Routine "quiz" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var thanksMaxDurationReached;
var _thanks_enter_allKeys;
var thanksMaxDuration;
var thanksComponents;
function thanksRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'thanks' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    thanksClock.reset();
    routineTimer.reset();
    thanksMaxDurationReached = false;
    // update component parameters for each repeat
    thanks_enter.keys = undefined;
    thanks_enter.rt = undefined;
    _thanks_enter_allKeys = [];
    thanksMaxDuration = null
    // keep track of which components have finished
    thanksComponents = [];
    thanksComponents.push(thank_you);
    thanksComponents.push(thanks_enter);
    
    for (const thisComponent of thanksComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function thanksRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'thanks' ---
    // get current time
    t = thanksClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *thank_you* updates
    if (t >= 0.0 && thank_you.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      thank_you.tStart = t;  // (not accounting for frame time here)
      thank_you.frameNStart = frameN;  // exact frame index
      
      thank_you.setAutoDraw(true);
    }
    
    
    // if thank_you is active this frame...
    if (thank_you.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *thanks_enter* updates
    if (t >= 0.0 && thanks_enter.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      thanks_enter.tStart = t;  // (not accounting for frame time here)
      thanks_enter.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { thanks_enter.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { thanks_enter.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { thanks_enter.clearEvents(); });
    }
    
    // if thanks_enter is active this frame...
    if (thanks_enter.status === PsychoJS.Status.STARTED) {
      let theseKeys = thanks_enter.getKeys({keyList: 'space', waitRelease: false});
      _thanks_enter_allKeys = _thanks_enter_allKeys.concat(theseKeys);
      if (_thanks_enter_allKeys.length > 0) {
        thanks_enter.keys = _thanks_enter_allKeys[_thanks_enter_allKeys.length - 1].name;  // just the last key pressed
        thanks_enter.rt = _thanks_enter_allKeys[_thanks_enter_allKeys.length - 1].rt;
        thanks_enter.duration = _thanks_enter_allKeys[_thanks_enter_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of thanksComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function thanksRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'thanks' ---
    for (const thisComponent of thanksComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    thanks_enter.stop();
    // the Routine "thanks" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


function importConditions(snapshot) {
  return async function () {
    // snapshot приходит из stimLoop.getSnapshot() в цикле наверху.
    // Если trialList у TrialHandler — это массив объектов, то snapshot уже содержит поля.
    if (typeof snapshot !== 'undefined' && snapshot !== null) {
      try {
        psychoJS.importAttributes(snapshot);
      } catch (e) {
        // Защита: если snapshot — обёртка с getCurrentTrial(), попробуем её
        if (typeof snapshot.getCurrentTrial === 'function') {
          const trialAttrs = snapshot.getCurrentTrial();
          if (trialAttrs) {
            psychoJS.importAttributes(trialAttrs);
          }
        }
      }
    }
    return Scheduler.Event.NEXT;
    };
}


async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
