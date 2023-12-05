import { PluginOption } from 'vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

export function viteYaml(): PluginOption[] {
    return [ViteYaml()];
}
