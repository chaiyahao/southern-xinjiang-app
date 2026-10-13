package com.trippocket.byauthor;
import com.google.androidbrowserhelper.trusted.LauncherActivity;
import android.net.Uri;

public class MainActivity extends LauncherActivity {
    @Override
    protected Uri getLaunchingUrl() {
        return Uri.parse("https://trippocketbyarthur.vercel.app/");
    }
}
