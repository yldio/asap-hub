((nil
  . (
     ;; Enable typescript-language-server and eslint LSP clients.
     (lsp-enabled-clients . (ts-ls eslint))
     (eval . (lexical-let ((project-directory (car (dir-locals-find-file default-directory))))
               (set (make-local-variable 'flycheck-javascript-eslint-executable)
                    (concat project-directory ".yarn/sdks/eslint/bin/eslint.js"))

               (eval-after-load 'lsp-javascript
                 '(progn
                    (plist-put lsp-deps-providers
                               :local (list :path (lambda (path) (concat project-directory ".yarn/sdks/" path))))

                    (lsp-dependency 'typescript-language-server
                                    '(:system "/usr/bin/typescript-language-server"))
                    (lsp-dependency 'typescript
                                    '(:local "typescript/bin/tsserver"))))

               )))))
