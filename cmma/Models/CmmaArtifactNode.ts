import CmmaArtifactLabelObject from 'Cmma/TypeChecking/CmmaArtifactLabelObject'

export default class ArtifactNode {
  public label
  public ext
  public artifactType

  constructor(private artifact: CmmaArtifactLabelObject) {
    this.label = artifact.artifactLabel
    this.artifactType = artifact.artifactType
    this.ext = ''
  }

  public get artifactGroupLabel() {
    return this.artifact.artifactType
  }
}
