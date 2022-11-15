export declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cadesplugin: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cadesplugin_load_timeout: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cadesplugin_skip_extension_install: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cpcsp_chrome_nmcades: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opr: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [type: string]: any;
  }
}

declare const window: Window;
