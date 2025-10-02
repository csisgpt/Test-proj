
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "@company/shared": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild___mf_0_company_mf_1_shared__prebuild__.js")
          return pkg
        }
      ,
        "@company/state": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild___mf_0_company_mf_1_state__prebuild__.js")
          return pkg
        }
      ,
        "@company/ui": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild___mf_0_company_mf_1_ui__prebuild__.js")
          return pkg
        }
      ,
        "pinia": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild__pinia__prebuild__.js")
          return pkg
        }
      ,
        "vue": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild__vue__prebuild__.js")
          return pkg
        }
      ,
        "vue-router": async () => {
          let pkg = await import("__mf__virtual/pharmacy__prebuild__vue_mf_2_router__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "@company/shared": {
            name: "@company/shared",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "pharmacy",
            async get () {
              usedShared["@company/shared"].loaded = true
              const {"@company/shared": pkgDynamicImport} = importMap 
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
              singleton: false,
              requiredVersion: "^1.0.0"
            }
          }
        ,
          "@company/state": {
            name: "@company/state",
            version: "1.0.0",
            scope: ["default"],
            loaded: false,
            from: "pharmacy",
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
            from: "pharmacy",
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
            from: "pharmacy",
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
              requiredVersion: "^2.1.0"
            }
          }
        ,
          "vue": {
            name: "vue",
            version: "3.5.21",
            scope: ["default"],
            loaded: false,
            from: "pharmacy",
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
              requiredVersion: "^3.4.0"
            }
          }
        ,
          "vue-router": {
            name: "vue-router",
            version: "4.5.1",
            scope: ["default"],
            loaded: false,
            from: "pharmacy",
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
              requiredVersion: "^4.2.0"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      