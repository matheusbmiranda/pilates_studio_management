
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface YouTubePlayerProps {
    videoUrl?: string | null;
}

function extrairVideoId(url: string): string | null {
    try {
        const urlObj = new URL(url.trim());
        const host = urlObj.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            return urlObj.pathname.split('/').filter(Boolean)[0] ?? null;
        }

        if (
            ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
        ) {
            if (urlObj.pathname === '/watch') {
                return urlObj.searchParams.get('v');
            }

            const partes = urlObj.pathname.split('/').filter(Boolean);

            if (['embed', 'shorts', 'live'].includes(partes[0])) {
                return partes[1] ?? null;
            }
        }

        return null;
    } catch {
        return null;
    }
}

export default function YouTubePlayer({
                                          videoUrl,
                                      }: YouTubePlayerProps) {
    const [reproduzir, setReproduzir] = useState(false);
    const [carregando, setCarregando] = useState(false);

    if (!videoUrl?.trim()) {
        return null;
    }

    const videoId = extrairVideoId(videoUrl);

    if (!videoId) {
        return (
            <View style={styles.erro}>
                <Text style={styles.erroTexto}>
                    Link do YouTube inválido
                </Text>
            </View>
        );
    }

    const thumbnailUrl =
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const embedUrl =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;

    const IFrame = 'iframe' as any;

    return (
        <View style={styles.container}>
            {!reproduzir ? (
                <Pressable
                    style={styles.previa}
                    onPress={() => {
                        setCarregando(true);
                        setReproduzir(true);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Reproduzir vídeo do exercício"
                >
                    <Image
                        source={{ uri: thumbnailUrl }}
                        style={styles.thumbnail}
                        resizeMode="contain"
                    />

                    <View style={styles.botaoPlay}>
                        <Text style={styles.simboloPlay}>▶</Text>
                    </View>
                </Pressable>
            ) : Platform.OS === 'web' ? (
                <IFrame
                    src={embedUrl}
                    title="Vídeo demonstrativo do exercício"
                    style={styles.iframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setCarregando(false)}
                />
            ) : (
                <View style={styles.player}>
                    {carregando ? (
                        <View style={styles.carregamento}>
                            <ActivityIndicator
                                size="large"
                                color="#FFFFFF"
                            />
                        </View>
                    ) : null}

                    <YoutubePlayer
                        height={180}
                        videoId={videoId}
                        play
                        onReady={() => setCarregando(false)}
                        onError={() => setCarregando(false)}
                        webViewStyle={styles.webView}
                    />
                </View>
            )}

            {reproduzir && carregando && Platform.OS === 'web' ? (
                <View style={styles.carregamento}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: '#161B22',
        position: 'relative',
    },
    previa: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161B22',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    botaoPlay: {
        position: 'absolute',
        width: 52,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000',
    },
    simboloPlay: {
        color: '#FFFFFF',
        fontSize: 20,
        marginLeft: 3,
    },
    player: {
        flex: 1,
        justifyContent: 'center',
    },
    iframe: {
        width: '100%',
        height: '100%',
        borderWidth: 0,
    } as any,
    webView: {
        backgroundColor: '#161B22',
    },
    carregamento: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#161B22',
    },
    erro: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 10,
        backgroundColor: '#F7F8F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    erroTexto: {
        color: '#B42318',
        fontSize: 13,
    },
});
