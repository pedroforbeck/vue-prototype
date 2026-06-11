import JSZip from 'jszip';

export function useSkinLoader() {
  const parseSkin = async (fileOrBlob) => {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(fileOrBlob);
      const skinData = {};

      // Skins de Winamp não diferenciam maiúsculas/minúsculas no Windows, mas as chaves do JSZip sim.
      const files = Object.keys(contents.files);
      
      const getFileBlobUrl = async (filename) => {
        const match = files.find(f => {
          const lowerF = f.toLowerCase();
          const lowerName = filename.toLowerCase();
          return lowerF === lowerName || lowerF.endsWith('/' + lowerName) || lowerF.endsWith('\\\\' + lowerName);
        });
        if (match) {
          const blob = await contents.files[match].async('blob');
          return URL.createObjectURL(blob);
        }
        return null;
      };

      // Extrai os bitmaps (imagens) fundamentais
      skinData.main = await getFileBlobUrl('main.bmp');
      skinData.titlebar = await getFileBlobUrl('titlebar.bmp');
      skinData.cbuttons = await getFileBlobUrl('cbuttons.bmp');
      skinData.eqmain = await getFileBlobUrl('eqmain.bmp');
      skinData.volume = await getFileBlobUrl('volume.bmp');
      skinData.pledit = await getFileBlobUrl('pledit.bmp');
      skinData.gen = await getFileBlobUrl('gen.bmp');
      
      return skinData;
    } catch (err) {
      console.error('Failed to parse WSZ skin:', err);
      return null;
    }
  };

  return { parseSkin };
}
