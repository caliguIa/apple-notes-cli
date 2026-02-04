// Convert number sequence to binary file for protoc
const input =
  `8 0 18 191 5 8 0 16 0 26 184 5 18 32 84 101 115 116 32 49 49 58 32 84 119 111 32 119 111 114 100 115 226 128 168 66 111 108 100 32 105 116 97 108 105 99 26 16 10 4 8 0 16 0 16 0 26 4 8 0 16 0 40 1 26 16 10 4 8 1 16 26 16 9 26 4 8 1 16 0 40 2 26 16 10 4 8 1 16 0 16 1 26 4 8 1 16 1 40 3 26 16 10 4 8 1 16 1 16 7 26 4 8 1 16 0 40 4 26 16 10 4 8 1 16 35 16 1 26 4 8 1 16 0 40 5 26 18 10 4 8 1 16 8 16 5 26 4 8 1 16 8 32 1 40 6 26 18 10 4 8 1 16 13 16 1 26 4 8 1 16 9 32 1 40 7 26 16 10 4 8 1 16 14 16 12 26 4 8 1 16 0 40 8 26 22 10 8 8 0 16 255 255 255 255 15 16 0 26 8 8 0 16 255 255 255 255 15 34 28 10 26 10 16 56 96 135 188 6 175 68 89 150 136 101 238 251 50 148 35 18 2 8 36 18 2 8 10 42 30 8 3 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 146 249 193 185 6 42 30 8 4 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 147 249 193 185 6 42 30 8 2 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 148 249 193 185 6 42 30 8 4 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 204 242 193 185 6 42 30 8 3 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 205 242 193 185 6 42 30 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 207 242 193 185 6 42 30 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 153 249 193 185 6 42 30 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 104 210 242 193 185 6 42 32 8 2 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 1 104 214 242 193 185 6 42 32 8 2 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 1 104 215 242 193 185 6 42 32 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 0 104 218 242 193 185 6 42 32 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 2 104 221 242 193 185 6 42 32 8 4 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 2 104 222 242 193 185 6 42 32 8 1 18 20 24 1 74 16 227 244 122 203 192 122 70 247 148 228 89 160 224 116 143 59 40 2 104 223 242 193 185 6`;

// Convert the space-separated string of numbers to a Uint8Array
const numbers = input.split(" ").map((num) => parseInt(num, 10));
const binaryData = new Uint8Array(numbers);

// Write the binary data to a file
await Deno.writeFile("message.bin", binaryData);

console.log("Binary file 'message.bin' has been created.");
console.log("You can now run: protoc --decode_raw < message.bin");

// // Optionally, you can try to execute protoc directly
// try {
//   const command = new Deno.Command("protoc", {
//     args: ["--decode_raw"],
//     stdin: "piped",
//   });
//
//   const process = command.spawn();
//   const writer = process.stdin.getWriter();
//   await writer.write(binaryData);
//   await writer.close();
//
//   const { success, stdout, stderr } = await process.output();
//
//   if (success) {
//     const decoder = new TextDecoder();
//     console.log("\nProtoc output:");
//     console.log(decoder.decode(stdout));
//   } else {
//     console.error("\nError running protoc:", decoder.decode(stderr));
//   }
// } catch (error) {
//   console.error(
//     "\nFailed to run protoc. Make sure it's installed:",
//     error.message,
//   );
// }
