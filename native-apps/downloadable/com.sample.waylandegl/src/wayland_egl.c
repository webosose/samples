// Copyright (c) 2020-2025 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <wayland-client.h>
#include <wayland-egl.h>
#include <wayland-webos-shell-client-protocol.h>
#include <EGL/egl.h>
#include <GLES2/gl2.h>

struct wl_display *g_pstDisplay = NULL;
struct wl_compositor *g_pstCompositor = NULL;
struct wl_surface *g_pstSurface = NULL;
struct wl_shell *g_pstShell = NULL;
struct wl_shell_surface *g_pstShellSurface = NULL;
struct wl_webos_shell *g_pstWebOSShell = NULL;
struct wl_webos_shell_surface *g_pstWebosShellSurface = NULL;
struct wl_egl_window *g_pstEglWindow = NULL;
struct wl_seat *g_pstSeat = NULL;
struct wl_pointer *g_pstPointer = NULL;
struct wl_keyboard *g_pstKeyboard = NULL;
struct wl_touch *g_pstTouch = NULL;

EGLDisplay g_pstEglDisplay = NULL;
EGLConfig g_pstEglConfig = NULL;
EGLSurface g_pstEglSurface = NULL;
EGLContext g_pstEglContext = NULL;

static void finalize();

//mouse event
static void pointer_handle_enter(void *data, struct wl_pointer *pointer, uint32_t serial, struct wl_surface *surface, wl_fixed_t sx, wl_fixed_t sy)
{
    fprintf(stderr, "Pointer entered surface %p at %d %d\n", surface, sx, sy);
}

static void pointer_handle_leave(void *data, struct wl_pointer *pointer, uint32_t serial, struct wl_surface *surface)
{
    fprintf(stderr, "Pointer left surface %p\n", surface);
}

static void pointer_handle_motion(void *data, struct wl_pointer *pointer, uint32_t time, wl_fixed_t sx, wl_fixed_t sy)
{
    fprintf(stderr, "Pointer moved at %d %d\n", sx, sy);
}

static void pointer_handle_button(void *data, struct wl_pointer *wl_pointer, uint32_t serial, uint32_t time, uint32_t button, uint32_t state)
{
    printf("Pointer button\n");
}

static void pointer_handle_axis(void *data, struct wl_pointer *wl_pointer, uint32_t time, uint32_t axis, wl_fixed_t value)
{
    fprintf(stderr,"Pointer handle axis\n");
}

static const struct wl_pointer_listener pointer_listener = {
    .enter = pointer_handle_enter,
    .leave = pointer_handle_leave,
    .motion = pointer_handle_motion,
    .button = pointer_handle_button,
    .axis = pointer_handle_axis
};

//keyboard event
static void keyboard_handle_keymap(void *data, struct wl_keyboard *keyboard, uint32_t format, int fd, uint32_t size)
{
}

static void keyboard_handle_enter(void *data, struct wl_keyboard *keyboard, uint32_t serial, struct wl_surface *surface, struct wl_array *keys)
{
    fprintf(stderr, "Keyboard gained focus\n");
}

static void keyboard_handle_leave(void *data, struct wl_keyboard *keyboard, uint32_t serial, struct wl_surface *surface)
{
    fprintf(stderr, "Keyboard lost focus\n");
}

static void keyboard_handle_key(void *data, struct wl_keyboard *keyboard, uint32_t serial, uint32_t time, uint32_t key, uint32_t state)
{
    fprintf(stderr, "Key is %d state is %d\n", key, state);
}

static void keyboard_handle_modifiers(void *data, struct wl_keyboard *keyboard, uint32_t serial, uint32_t mods_depressed, uint32_t mods_latched, uint32_t mods_locked, uint32_t group)
{
    fprintf(stderr, "Modifiers depressed %d, latched %d, locked %d, group %d\n", mods_depressed, mods_latched, mods_locked, group);
}

static const struct wl_keyboard_listener keyboard_listener = {
    .keymap = keyboard_handle_keymap,
    .enter = keyboard_handle_enter,
    .leave = keyboard_handle_leave,
    .key = keyboard_handle_key,
    .modifiers = keyboard_handle_modifiers
};

//touch event
static void touch_handle_down(void *data, struct wl_touch *wl_touch, uint32_t serial, uint32_t time, struct wl_surface *surface, int32_t id, wl_fixed_t x, wl_fixed_t y)
{
    fprintf(stderr, "Touch handle down\n");
}

static void touch_handle_up(void *data, struct wl_touch *wl_touch, uint32_t serial, uint32_t time, int32_t id)
{
    fprintf(stderr, "Touch handle up\n");
}

static void touch_handle_motion(void *data, struct wl_touch *wl_touch, uint32_t time, int32_t id, wl_fixed_t x, wl_fixed_t y)
{
    fprintf(stderr, "Touch handle motion at %d %d\n", x, y);
}

static void touch_handle_frame(void *data, struct wl_touch *wl_touch)
{

}

static void touch_handle_cancel(void *data, struct wl_touch *wl_touch)
{

}

static const struct wl_touch_listener touch_listener = {
    .down = touch_handle_down,
    .up = touch_handle_up,
    .motion = touch_handle_motion,
    .frame = touch_handle_frame,
    .cancel = touch_handle_cancel
};

static void seat_handle_capabilities(void *data, struct wl_seat *seat, enum wl_seat_capability caps)
{
    if ((caps & WL_SEAT_CAPABILITY_KEYBOARD) && !g_pstKeyboard)
    {
	    g_pstKeyboard = wl_seat_get_keyboard(seat);
	    wl_keyboard_add_listener(g_pstKeyboard, &keyboard_listener, NULL);
    }
    else if (!(caps & WL_SEAT_CAPABILITY_KEYBOARD) && g_pstKeyboard)
    {
	    wl_keyboard_destroy(g_pstKeyboard);
	    g_pstKeyboard = NULL;
    }

    if ((caps & WL_SEAT_CAPABILITY_POINTER) && !g_pstPointer)
    {
	    g_pstPointer = wl_seat_get_pointer(seat);
	    wl_pointer_add_listener(g_pstPointer, &pointer_listener, NULL);
    }
    else if (!(caps & WL_SEAT_CAPABILITY_POINTER) && g_pstPointer)
    {
	    wl_pointer_destroy(g_pstPointer);
	    g_pstPointer = NULL;
    }

    if ((caps & WL_SEAT_CAPABILITY_TOUCH) && !g_pstTouch)
    {
	    g_pstTouch = wl_seat_get_touch(seat);
	    wl_touch_add_listener(g_pstTouch, &touch_listener, NULL);
    }
    else if (!(caps & WL_SEAT_CAPABILITY_TOUCH) && g_pstTouch)
    {
	    wl_touch_destroy(g_pstTouch);
	    g_pstTouch = NULL;
    }
}

static void seat_name(void *data, struct wl_seat *seat, const char *name)
{
    fprintf(stderr, "Seat name changed to: %s\n", name);
}

static const struct wl_seat_listener seat_listener = {
    seat_handle_capabilities,
    seat_name
};

static void registryHandler(void *data, struct wl_registry *registry, uint32_t id, const char *interface, uint32_t version)
{
    if (strcmp(interface, "wl_compositor") == 0)
    {
        g_pstCompositor = wl_registry_bind(registry, id, &wl_compositor_interface, 1);
    }
    else if (strcmp(interface, "wl_shell") == 0)
    {
        g_pstShell = wl_registry_bind(registry, id, &wl_shell_interface, 1);
    }
    else  if (strcmp(interface, "wl_webos_shell") == 0)
    {
        g_pstWebOSShell = wl_registry_bind(registry, id, &wl_webos_shell_interface, 1);
    }
    else if (strcmp(interface, "wl_seat") == 0)
    {
        g_pstSeat = wl_registry_bind(registry, id, &wl_seat_interface, 1);
        wl_seat_add_listener(g_pstSeat, &seat_listener, NULL);
    }
}

static void registryRemover(void *data, struct wl_registry *registry, uint32_t id)
{
}

static const struct wl_registry_listener s_stRegistryListener = {
    registryHandler,
    registryRemover
};

static void webosShellHandleState(void *data, struct wl_webos_shell_surface *wl_webos_shell_surface, uint32_t state)
{
    switch(state)
    {
        case WL_WEBOS_SHELL_SURFACE_STATE_FULLSCREEN:
            break;
        case WL_WEBOS_SHELL_SURFACE_STATE_MINIMIZED:
            break;
    }
}

static void webosShellHandlePosition(void *data, struct wl_webos_shell_surface *wl_webos_shell_surface, int32_t x, int32_t y)
{
}

static void webosShellHandleClose(void *data, struct wl_webos_shell_surface *wl_webos_shell_surface)
{
    finalize();
    exit(0);
}

static void webosShellHandleExpose(void *data, struct wl_webos_shell_surface *wl_webos_shell_surface, struct wl_array *rectangles)
{
}

static void webosShellHandleStateAboutToChange(void *data, struct wl_webos_shell_surface *wl_webos_shell_surface, uint32_t state)
{
}

static const struct wl_webos_shell_surface_listener s_pstWebosShellListener = {
    webosShellHandleState,
    webosShellHandlePosition,
    webosShellHandleClose,
    webosShellHandleExpose,
    webosShellHandleStateAboutToChange
};

static void getWaylandServer()
{
    struct wl_registry *pstRegistry = NULL;

    g_pstDisplay = wl_display_connect(NULL);
    if (g_pstDisplay == NULL)
    {
        fprintf(stderr, "ERROR, cannot connect!\n");
        exit(1);
    }

    pstRegistry = wl_display_get_registry(g_pstDisplay);
    wl_registry_add_listener(pstRegistry, &s_stRegistryListener, NULL);

    wl_display_dispatch(g_pstDisplay);
    // wait for a synchronous response
    wl_display_roundtrip(g_pstDisplay);

    if (g_pstCompositor == NULL || g_pstShell == NULL || g_pstWebOSShell == NULL)
    {
        fprintf(stderr, "ERROR, cannot find compositor / shell\n");
        exit(1);
    }

    g_pstSurface = wl_compositor_create_surface(g_pstCompositor);
    if (g_pstSurface == NULL)
    {
        fprintf(stderr, "ERROR, cannot create surface \n");
        exit(1);
    }

    g_pstShellSurface = wl_shell_get_shell_surface(g_pstShell, g_pstSurface);
    if (g_pstShellSurface == NULL)
    {
        fprintf(stderr, "Can't create shell surface\n");
        exit(1);
    }
    wl_shell_surface_set_toplevel(g_pstShellSurface);

    // Please see wayland-webos-shell-client-protocol.h file for webOS specific wayland protocol
    g_pstWebosShellSurface = wl_webos_shell_get_shell_surface(g_pstWebOSShell, g_pstSurface);
    if (g_pstWebosShellSurface == NULL)
    {
        fprintf(stderr, "Can't create webos shell surface\n");
        exit(1);
    }
    wl_webos_shell_surface_add_listener(g_pstWebosShellSurface, &s_pstWebosShellListener, g_pstDisplay);
    wl_webos_shell_surface_set_property(g_pstWebosShellSurface, "appId", (getenv("APP_ID") ? getenv("APP_ID") : "com.sample.waylandegl"));
    // for secondary display, set the last parameter as 1
    wl_webos_shell_surface_set_property(g_pstWebosShellSurface, "displayAffinity", (getenv("DISPLAY_ID") ? getenv("DISPLAY_ID") : "0"));
}

static void createWindow()
{
    // webOS only supports full screen size
    g_pstEglWindow = wl_egl_window_create(g_pstSurface, 1920, 1080);

    if (g_pstEglWindow == EGL_NO_SURFACE)
    {
        fprintf(stderr, "ERROR, cannot create wayland egl window\n");
        exit(1);
    }

    g_pstEglSurface = eglCreateWindowSurface(g_pstEglDisplay, g_pstEglConfig, g_pstEglWindow, NULL);

    if (!eglMakeCurrent(g_pstEglDisplay, g_pstEglSurface, g_pstEglSurface, g_pstEglContext))
    {
        fprintf(stderr, "ERROR, cannot make current\n");
    }
}

static void initEgl() {
    EGLint major, minor, count, n, size;
    EGLConfig *configs;
    int i;

    EGLint configAttributes[] = {
            EGL_SURFACE_TYPE, EGL_WINDOW_BIT,
            EGL_RED_SIZE, 8,
            EGL_GREEN_SIZE, 8,
            EGL_BLUE_SIZE, 8,
            EGL_RENDERABLE_TYPE, EGL_OPENGL_ES2_BIT,
            EGL_NONE
    };

    static const EGLint contextAttributes[] = {
        EGL_CONTEXT_CLIENT_VERSION, 2,
        EGL_NONE
    };

    g_pstEglDisplay = eglGetDisplay((EGLNativeDisplayType) g_pstDisplay);
    if (g_pstEglDisplay == EGL_NO_DISPLAY)
    {
        fprintf(stderr, "ERROR, cannot create create egl g_pstDisplay\n");
        exit(1);
    }

    if (eglInitialize(g_pstEglDisplay, &major, &minor) != EGL_TRUE)
    {
        fprintf(stderr, "ERROR, cannot initialize egl g_pstDisplay\n");
        exit(1);
    }
    eglGetConfigs(g_pstEglDisplay, NULL, 0, &count);
    configs = (EGLConfig*)calloc(count, sizeof(EGLConfig));
    eglChooseConfig(g_pstEglDisplay, configAttributes, configs, count, &n);
    // simply choose the first config
    g_pstEglConfig = configs[0];
    g_pstEglContext = eglCreateContext(g_pstEglDisplay, g_pstEglConfig, EGL_NO_CONTEXT, contextAttributes);
}

static void finalize()
{
    eglDestroyContext(g_pstEglDisplay, g_pstEglContext);
    eglDestroySurface(g_pstEglDisplay, g_pstEglSurface);
    eglTerminate(g_pstEglDisplay);
    wl_display_disconnect(g_pstDisplay);
}

int main(int argc, char **argv)
{
    getWaylandServer();
    initEgl();
    createWindow();

    while (wl_display_dispatch_pending(g_pstDisplay) != -1)
    {
        glClearColor(1.0, 1.0, 0.0, 1.0);
        glClear(GL_COLOR_BUFFER_BIT);
        glFlush();
        eglSwapBuffers(g_pstEglDisplay, g_pstEglSurface);
    }

    finalize();
    exit(0);
}
