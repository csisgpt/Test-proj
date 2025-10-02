
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "@company/api": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_company_mf_1_api__prebuild__.js")
          return pkg
        }
      ,
        "@company/auth": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_company_mf_1_auth__prebuild__.js")
          return pkg
        }
      ,
        "@company/state": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_company_mf_1_state__prebuild__.js")
          return pkg
        }
      ,
        "@company/ui": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild___mf_0_company_mf_1_ui__prebuild__.js")
          return pkg
        }
      ,
        "pinia": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__pinia__prebuild__.js")
          return pkg
        }
      ,
        "vue": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__vue__prebuild__.js")
          return pkg
        }
      ,
        "vue-router": async () => {
          let pkg = await import("__mf__virtual/shell__prebuild__vue_mf_2_router__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "@company/api": {
            name: "@company/api",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["@company/api"].loaded = true
              const {"@company/api": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0"
            }
          }
        ,
          "@company/auth": {
            name: "@company/auth",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["@company/auth"].loaded = true
              const {"@company/auth": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0"
            }
          }
        ,
          "@company/state": {
            name: "@company/state",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["@company/state"].loaded = true
              const {"@company/state": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0"
            }
          }
        ,
          "@company/ui": {
            name: "@company/ui",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["@company/ui"].loaded = true
              const {"@company/ui": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^1.0.0"
            }
          }
        ,
          "pinia": {
            name: "pinia",
            version: "2.3.1",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["pinia"].loaded = true
              const {"pinia": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.3.1"
            }
          }
        ,
          "vue": {
            name: "vue",
            version: "3.5.21",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["vue"].loaded = true
              const {"vue": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^3.5.21"
            }
          }
        ,
          "vue-router": {
            name: "vue-router",
            version: "4.5.1",
            scope: ["default"],
            loaded: false,
            from: "shell",
            async get () {
              usedShared["vue-router"].loaded = true
              const {"vue-router": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^4.5.1"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      