if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/kotwa/.gradle/caches/8.14.3/transforms/d8d85eea07b70d0a756d35390e1aea37/transformed/hermes-android-0.81.4-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/kotwa/.gradle/caches/8.14.3/transforms/d8d85eea07b70d0a756d35390e1aea37/transformed/hermes-android-0.81.4-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

