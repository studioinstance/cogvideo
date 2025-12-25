module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "../env",                // Edit this to customize the venv folder path
        env: {
          "PYTORCH_ENABLE_MPS_FALLBACK": "1",
          "PYTORCH_CUDA_ALLOC_CONF": "expandable_segments:True,max_split_size_mb:512",
          // メモリ使用量を制限する環境変数
          "PYTORCH_NO_CUDA_MEMORY_CACHING": "0",
          // CPUメモリの使用を最適化
          "OMP_NUM_THREADS": "2",
          "MKL_NUM_THREADS": "2",
          // ディスクキャッシュの制限（GB単位、デフォルトは無制限）
          "HF_HOME": "{{cwd}}/cache/HF_HOME",
          "TORCH_HOME": "{{cwd}}/cache/TORCH_HOME",
          "GRADIO_TEMP_DIR": "{{cwd}}/cache/GRADIO_TEMP_DIR"
        },                   // Edit this to customize environment variables (see documentation)
        path: "app/inference",                // Edit this to customize the path to start the shell from
        message: [
          "python gradio_web_demo.py"
        ],
        on: [{
          // The regular expression pattern to monitor.
          // When this pattern occurs in the shell terminal, the shell will return,
          // and the script will go onto the next step.
          "event": "/(http:\\/\\/[0-9.:]+)/",   

          // "done": true will move to the next step while keeping the shell alive.
          // "kill": true will move to the next step after killing the shell.
          "done": true
        }]
      }
    },
    {
      // This step sets the local variable 'url'.
      // This local variable will be used in pinokio.js to display the "Open WebUI" tab when the value is set.
      method: "local.set",
      params: {
        // the input.event is the regular expression match object from the previous step
        url: "{{input.event[1]}}"
      }
    }
  ]
}
