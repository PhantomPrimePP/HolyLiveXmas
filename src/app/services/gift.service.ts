import { Injectable } from '@angular/core';
import { supabase } from '../supabaseClient';
import giftsData from '../../assets/json/gifts.json';

@Injectable({
  providedIn: 'root'
})
export class GiftService {

  constructor() {}

  // Upload file + save metadata
 async uploadGift(name: string, boxImage: string, file: File | null, type: string, message: string, youtubeUrl?: string) {
  try {
    let fileUrl = null;
    let fileType = null;

if (type === "file" && file) {
  fileType = file.type;
}

if (type === "youtube") {
  fileType = "youtube";
}

if (type === "message") {
  fileType = "message";   // 🔥 ADD THIS
}

    // If gift is a file → upload to storage
    if (type === "file" && file) {

      const filePath = `${Date.now()}_${file.name}`;

      const { error: storageError } = await supabase.storage
        .from('Gifts')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('Gifts')
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl
       fileType = file.type;

       

    }
    
    

if (type === "youtube") {
  fileUrl = youtubeUrl;
  fileType = "youtube";
}
    // Insert gift metadata into database
   const { error: dbError } = await supabase
  .from('Gifts')
  .insert({
  Name: name,
  BoxImage: boxImage,
  FileURL: fileUrl,
  FileType: fileType,
  Message: type === "message" ? message : null
});
    if (dbError) throw dbError;

    return { success: true };

  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: err };
  }
}
  // Fetch all gifts for Room page
 // async getAllGifts() {
//    const { data, error } = await supabase
  //    .from('Gifts')    // MUST match table name EXACTLY
 ////     .select('*')
 //     .order('created_at', { ascending: false });
//
 //   if (error) console.error("Error loading Gifts:", error);

////    return data || [];
  //}
 getAllGifts() {
 return giftsData;
  }


}
