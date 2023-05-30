import { join } from 'path'
import { pathExists } from 'fs-extra'
import { BaseCommand } from '@adonisjs/core/build/standalone'

/**
 * Base class to generate framework entities
 */
export abstract class BaseGenerator extends BaseCommand {
  protected abstract resourceName: string
  protected abstract createExact: boolean
  protected suffix?: string
  protected extname: string = '.ts'
  protected form?: 'singular' | 'plural'
  protected pattern?: 'camelcase' | 'snakecase' | 'pascalcase'
  protected formIgnoreList?: string[]

  /**
   * Handle command
   */
  public async generate() {
    const hasRcFile = await this.hasRcFile(this.application.appRoot)

    /**
     * Ensure `.adonisrc.json` file exists
     */
    if (!hasRcFile) {
      this.logger.error('Make sure your project root has ".adonisrc.json" file')
      return
    }

    const transformations = this.createExact
      ? {
          extname: this.extname,
        }
      : {
          form: this.form,
          suffix: this.suffix,
          formIgnoreList: this.formIgnoreList,
          pattern: this.pattern,
          extname: this.extname,
        }

    const file = this.generator
      .addFile(this.resourceName, transformations)
      .stub(this.getStub())
      .useMustache()
      .destinationDir(this.getDestinationPath())
      .appRoot(this.application.appRoot)
      .apply(this.templateData())

    await this.generator.run()
    return file
  }

  protected abstract getStub(): string

  protected abstract getDestinationPath(): string

  protected templateData(): any {
    return {}
  }

  /**
   * Returns path for a given namespace by replacing the base namespace
   * with the defined directories map inside the `.adonisrc.json`
   * file
   */
  protected getPathForNamespace(namespaceFor: string): string | null {
    return this.application.resolveNamespaceDirectory(namespaceFor)
  }

  /**
   * Returns contents of the rcFile
   */
  protected async hasRcFile(cwd: string) {
    const filePath = join(cwd, '.adonisrc.json')
    return pathExists(filePath)
  }
}
