declare module 'socket:os'
declare module 'socket:test'
declare module 'socket:console'
declare module 'socket:process'

declare interface Config {
  build_env: string
  build_flags: string
  build_headless: boolean
  build_input: string
  build_name: string
  build_output: string
  build_redirect: Location | (string & Location)
  build_script: string
  debug_flags: string
  ios_distribution_method: string
  ios_simulator_device: string
  linux_categories: string
  linux_cmd: string
  linux_icon: string
  mac_appstore_icon: string
  meta_bundle_identifier: string
  meta_copyright: string
  meta_description: string
  meta_file_limit: number
  meta_lang: string
  meta_maintainer: string
  meta_title: string
  meta_version: string
  native_files: string
  native_headers: string
  win_cmd: string
  win_logo: string
  win_pfx: string
  win_publisher: string
  window_height: string
  window_width: string
}
