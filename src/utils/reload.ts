/* 

Socket Reload Module
v2:
  supports keyboard mode by default

v2.1:
  fix linux and mac support (find app path)
  call application.backend.close()

Todo:
  Only works on desktop, there needs to be a way to tell mobile apps to update, and they should also pull assets from an http server

usage:

import enableSocketReload from './reload.js'

// method 1 - manual refresh using ctrl+r, cmd+r, F5
window.addEventListener("load", async () => {
  enableSocketReload({startDir: process.cwd()})
  // optionally implement a custom callback, you can use this to call custom cleanup code. defaults to window.location.reload()
  updateCallback: () => { window.location.reload() } 
})

// method 2 - live reload
window.addEventListener("load", async () => {
    enableSocketReload({startDir: process.cwd(),
    liveReload: true,
    scanInterval: 200, // how often to check for changes
    debounce: 1000, // how long to wait before calling updateCallback
    debounceCallback: () => { // This gets called when debounce is set (changes detected but updateCallback not called)
      console.log(`updates inbound...`);
    },
    // optionally implement a custom callback, called after debounce has elapsed
    updateCallback: () => {
      window.location.reload()
    }
  })
})

*/

import fs from 'socket:fs/promises'
import process from 'socket:process'
import Buffer from 'socket:buffer'
import Path from 'socket:path'
import application from 'socket:application'
import os from 'socket:os'

let enabled = false
let _interval = null
let _lastUpdate = 0
let scanInterval = 500
let _opts = {}

let _copyPath = undefined
let _debounce_handle = null;

const recursePath = async(path, file_fn, data) => {
  for (const entry of (await fs.readdir(path, {withFileTypes: true}))) {
    let entry_path = Path.join(path, entry.name)
    if (entry.isDirectory()) {
      await recursePath(entry_path, file_fn, data)
    } else {
      await file_fn(entry_path, data)
    }
  }
}

async function dirname(filename) {
  return Path.dirname(filename)
}

async function exists(name) {
  try {
    return fs.stat(name)
  } catch (_) {
    return undefined
  }
}

async function mkdir(folder) {
  // folder = folder.replaceAll('\\\\', '\\')
  if (await exists(folder)) {
    console.log(`${folder} exists`)
    return
  } else {
    // console.log(`mkdir ${Path.dirname(folder)}`)
    await mkdir(await Path.dirname(folder))
    // console.log(`mkdir ${folder}`)
    await fs.mkdir(folder)
  }
}

const enableSocketReload = async (opts = {}) => {
  // let testpath = 'D:\\code\\socket\\apps\\files-commander\\build\\win\\files-commander-dev-v1.0.0\\assets\\images\\blog.png'

  // await mkdir(Path.dirname(testpath))
  // console.log(`dirname: ${await Path.dirname(testpath)}`)
  // return;

  if (opts.enable === undefined) {
    opts.enable = true
  }

  if (opts.enable) {
    if (!opts.startDir) {
      throw "startDir must be defined to monitor for file changes."
    }
  }

  if (opts.liveReload === undefined) {
    opts.liveReload = false
  }

  console.log(`liveReload: ${opts.liveReload}`)

  _opts = opts;

  if (enabled === opts.enable)
    return

  if (opts.enable) {
    console.log(`platform: ${os.platform()}`)
    let osParent = '' // define os specific parent path
    os.platform() === 'darwin' && (osParent = '../')
    os.platform() === 'linux' && (osParent = '../')
    osParent = `${osParent}../../../..`
    let parentPath = Path.join(_opts.startDir, `${osParent}../../../..`);
    console.log(`ini path: ${`${parentPath}/socket.ini`}`)
    let _parentPath = Path.resolve(Path.join(_opts.startDir, `${osParent}`))
    if (os.platform() === 'win32' && (_parentPath.startsWith('/')) || (_parentPath.startsWith('\\')))
      _parentPath = _parentPath.substring(1)
    // _copyPath = Path.join(_parentPath, 'src')
    _copyPath = Path.join(_parentPath, window.__args.config.build_copy.replaceAll('"', '').trim())

    console.log(`enableSocketReload: ${opts.enable}, _path: ${_copyPath} => ${_opts.startDir}`)
    
    if (opts.debounce === undefined) {
      opts.debounce = -1
    }

    if (opts.scanInterval === undefined) {
      opts.scanInterval = scanInterval;
    }

    if (!opts.updateCallback) {
      opts.updateCallback = () => { window.location.reload() }
    }

    window.addEventListener("keydown", async(event) => {
      if(((event.ctrlKey || event.metaKey) && event.key === 'r') || event.key === 'F5') {
        event.preventDefault()
       await reload()
      }
    })

    if (opts.liveReload) {
      _interval = setInterval(checkRefresh, opts.scanInterval)
    }

    // checkRefresh()
    enabled = true
  } else {
    clearInterval(_interval)
    enabled = false;
  }
}

const reload = async () => {
  await sscBuildOutput(_opts.startDir)
  _opts.updateCallback()
  application.backend.close()
}

async function checkPath(filename) {

  try {
    console.log(`check path: ${filename}`)
    await fs.stat(filename)
  } catch (_) {
  }
}

const sscBuildOutput = async (dest) => {
  let recurseData = {
    dest: dest,
    base: _copyPath,
    changed: false,
  }

  checkPath(dest)
  checkPath(_copyPath)

  await recursePath(_copyPath, async (file, data) => {
    let dest_path = file.replace(data.base, data.dest)
    checkPath(dest_path)
    let update = false
    let exists = false
    try {
      exists = await fs.access(dest_path) // todo(mribbons) fs.access should not throw exception
    } catch {
      // console.log(`dest doesn't exist: ${dest_path}`);
    }
    checkPath(file)
    let stat1 = await fs.stat(file);
    if (exists) {
      let stat2 = await fs.stat(dest_path);

      if (stat1.mtimeMs > stat2.mtimeMs || stat1.size !== stat2.size) {
        // console.log(`update ${file}: ${stat1.mtimeMs} > ${stat2.mtimeMs}`)
        update = true;
      }
      //  else {
      //   console.log(`ok ${file}: ${stat1.mtimeMs} <= ${stat2.mtimeMs}`)
      // }
    } else {
      // console.log(`not in dest ${file} => ${dest_path}`)
      update = true
    }
    
    if (update) {
      // todo(@mribbons): fs.mkdir(dirname(dest_path)) - dirname / drive letter issue on win32
      // console.log(`copy file: ${file} -> ${dest_path}`)
      // todo(@mribbons) - copyFile and utimes are noops. Without utimes we can't check times are even, only newer, which isn't great
      // await fs.copyFile(file, dest_path)
      // await fs.utimes(dest_path, parseInt(stat1.mtimeMs), parseInt(stat1.mtimeMs))
      // ensure parent exists
      await mkdir(Path.dirname(dest_path))
      await fs.writeFile(dest_path, await fs.readFile(file));
      data.changed = true
    }
  }, recurseData)

  // console.log(`recurse data changed: ${recurseData.changed}`)
  return recurseData.changed
}

const checkRefresh = async () => {
  try {
    // if (await sscBuildOutput(_opts.startDir)) {
    //   if (_opts.debounce > -1) {
    //     clearTimeout(_debounce_handle)
    //     // if debounce wait to update, other updates will reset update timeout
    //     setTimeout(() => {_opts.updateCallback()}, _opts.debounce)
        
    //     // Let consumer know that an update is coming
    //     if (_opts.debounceCallback) {
    //       _opts.debounceCallback();
    //     }
    //   } else {
    //     await _opts.updateCallback()
    //     application.backend.close()
    //   }
    // }
  } catch (e) {
    console.log(e)
  }
}

export default enableSocketReload