"use client"

import { useState } from "react"
import { Heart, MessageCircle, Send, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { communityPosts, communityCategories, student, type CommunityPost } from "@/lib/mock-data"

function PostCard({ post }: { post: CommunityPost }) {
  const t = useTranslations()
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const likeCount = post.likes + (liked ? 1 : 0)

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {post.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{post.author}</span>
              <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            </div>
            <h3 className="mt-2 font-heading text-base font-semibold text-foreground text-pretty">{post.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{post.content}</p>

            <div className="mt-3 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked((v) => !v)}
                className={liked ? "text-destructive" : "text-muted-foreground"}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {likeCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments((v) => !v)}
                className="text-muted-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments.length}
              </Button>
            </div>

            {showComments && (
              <div className="mt-3 space-y-3">
                <Separator />
                {post.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("community.firstToComment")}</p>
                )}
                {post.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                        {c.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-secondary/60 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.author}</span>
                        <span className="text-xs text-muted-foreground">{c.timeAgo}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.content}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t("community.commentPlaceholder")}
                      className="w-full rounded-full border border-input bg-background py-2 pl-4 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Send className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CommunityFeed() {
  const t = useTranslations()
  const [activeCategory, setActiveCategory] = useState("")
  const [composerOpen, setComposerOpen] = useState(false)

  const filtered =
    activeCategory === ""
      ? communityPosts
      : communityPosts.filter((p) => p.category === activeCategory)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <Card>
          <CardContent className="p-4">
            {!composerOpen ? (
              <button
                onClick={() => setComposerOpen(true)}
                className="flex w-full items-center gap-3 text-left"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
                    {student.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  {t("community.postPrompt")}
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <Textarea placeholder={t("community.postPlaceholder")} rows={3} />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setComposerOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="h-4 w-4" />
                    {t("community.publish")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button
            key="all"
            variant={activeCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("")}
            className={activeCategory === "" ? "bg-primary text-primary-foreground" : ""}
          >
            {t("community.filterAll")}
          </Button>
          {communityCategories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "bg-primary text-primary-foreground" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <aside className="hidden lg:block">
        <Card className="sticky top-24">
          <CardContent className="p-5">
            <h3 className="font-heading text-sm font-semibold text-foreground">{t("community.aboutTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("community.aboutDesc")}
            </p>
            <Separator className="my-4" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("community.members")}</span>
                <span className="font-semibold text-foreground">3.482</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("community.posts")}</span>
                <span className="font-semibold text-foreground">1.207</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("community.onlineNow")}</span>
                <span className="font-semibold text-accent">128</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
