package com.prayerappnative

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = DefaultReactNativeHost(this) {
        useDeveloperSupport = BuildConfig.DEBUG
        packages = PackageList(this).packages
        bundleAssetName = "index.android.bundle"
        is=true
      }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, /* native exopackage */ false)
    load(this, new DefaultReactNativeHost(this) {
      useDeveloperSupport = BuildConfig.DEBUG
      packages = PackageList(this).packages
      bundleAssetName = "index.android.bundle"
      is=true
    })
  }
}

