// تایپ حداقلی برای اجازه دادن به گزینه‌ی `persist` روی استورها
// اگر pinia-plugin-persistedstate نصب باشد، این Type Augmentation با آن سازگار است.

import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    persist?: any
  }
}
